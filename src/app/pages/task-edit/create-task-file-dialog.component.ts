import { ProjectInfo } from '../../core/interface/config-type';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormLayout, FormModule } from 'ng-devui/form';
import { FormsModule } from '@angular/forms';
import { ButtonModule, InputNumberModule, ToastService } from 'ng-devui';
import { TranslateModule } from '@ngx-translate/core';
import { Papa } from 'ngx-papaparse';
import { TableHttpService } from '../../core/services/https/table-http.service';
import { TipsDialogService } from '../../core/services/tips-dialog/tips-dialog.service';
import { defaultTaskData } from '../../core/mock/task-mock';


@Component({
  selector: 'app-create-task-file-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    FormsModule,
    InputNumberModule,
    ButtonModule,
    TranslateModule,],
  template: `
     <form dForm [layout]="vertical" ngForm>
     <d-form-item>
      <d-form-label [required]="true" [hasHelp]="true" [helpTips]="'帮助.任务.文件名' | translate">
      文件名
      </d-form-label>
      <d-form-control>
        <input dTextInput autocomplete="off" name="文件名" [(ngModel)]="fileName" />
      </d-form-control>
    </d-form-item>
  </form>
  <div class="modal-footer">
    <d-button (click)="createTaskCsvFile()" bsStyle="primary" circled="true">确定</d-button>
  </div>
  `,
  styles: ``
})
export class CreateTaskFileDialogComponent implements OnInit {
  @Input() data!: any
  projectInfo!: ProjectInfo
  closeDialog!: () => void;
  fileName: string = ''
  // 表单垂直布局
  vertical: FormLayout = FormLayout.Vertical;
  constructor(
    private tableHttp: TableHttpService,
    private toastService: ToastService,
    private tipsDialog: TipsDialogService,
    private papa: Papa,
  ) {

  }
  ngOnInit(): void {
    this.projectInfo = this.data.projectInfo;
    this.closeDialog = this.data.close;
  }


  // 添加步骤表格
  createTaskCsvFile() {
    this.fileName=this.fileName.trim();
    if(this.fileName===''){
      this.tipsDialog.openToEmptyDialog('任务文件名');
      return;
    }
    // 准备数据
    // eslint-disable-next-line prefer-const,
    let csvHeader: string[] = Object.keys(defaultTaskData);
    // 这里必须要加空一行必然可能导致执行的pandas无法正常加数据
    const csvArr = [csvHeader].concat(['']);
    const csvStr = this.papa.unparse(csvArr);
    const csvBlob = new Blob([csvStr], { type: 'text/csv' });
    const csvFile = new File([csvBlob], 'something.csv', { type: 'text/csv' });

    this.tableHttp.putCreateTaskCsvFile(
      this.projectInfo.executionSideInfo?.ipPort as string,
      this.projectInfo.name,
      this.fileName,
      csvFile
    ).subscribe({
      next: (data: any) => {
        this.toastService.open({
          value: [{ severity: 'success', summary: '摘要', content: data }],
        })
      },
      error: (err) => {
        this.tipsDialog.responseErrorState(err.status as number)
      },
      complete: () => {
        this.closeDialog();
      }
    }
    )
    this.closeDialog();
  }
}
