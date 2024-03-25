import { Component, Input, OnInit } from '@angular/core';
import { ProjectInfo } from '../../../../core/interface/config-type';
import { ButtonModule, FormLayout, FormModule, InputNumberModule, LoadingService, ModalComponent, SelectModule, ToastService, TooltipModule } from 'ng-devui';
import { TableHttpService } from '../../../../core/services/https/table-http.service';
import { TipsDialogService } from '../../../../core/services/tips-dialog/tips-dialog.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputGroupModule } from 'ng-devui/input-group';
import { defaultTaskData } from '../../../../core/mock/task-mock';
import { cloneDeep } from 'lodash';
import { TaskTableType } from '../../../../core/interface/table-type';

@Component({
  selector: 'app-task-table-form',
  standalone: true,
  imports: [CommonModule,
    FormModule,
    FormsModule,
    InputNumberModule,
    SelectModule,
    InputGroupModule,
    TooltipModule,
    ButtonModule,
    TranslateModule,],
  templateUrl: './task-table-form.component.html',
  styleUrl: './task-table-form.component.scss'
})
export class TaskTableFormComponent implements OnInit{
  @Input() projectInfo!: ProjectInfo;
  @Input() fileName!: string | number;

  @Input() modalInstance!: ModalComponent;
  @Input() modalContentInstance: any;
  // 参数对，初始一个预设的值
  @Input() args: TaskTableType = cloneDeep(defaultTaskData);
  stepFileList: string[] = []
  // 表单垂直布局
  vertical: FormLayout = FormLayout.Vertical;
  // 按钮点击后的载入提示
  btnShowLoading = false;

  constructor(
    private tableHttp: TableHttpService,
    private tipsService: TipsDialogService,
    private loadingService: LoadingService,
    private toastService: ToastService) {
  }
  ngOnInit(): void {
    this.setStepFileList();
  }

  // 设置步骤csv文件列表栏
  setStepFileList() {
    // 数据载入提示
    const loadTip = this.loadingService.open();
    this.tableHttp.getStepCsvFileList(
      this.projectInfo.executionSideInfo?.ipPort as string,
      this.projectInfo.name
    ).subscribe({
      next: (data: any) => {
        // eslint-disable-next-line prefer-const
        let newArr: string[] = []
        data.forEach((el: string) => {
          newArr.push(el.split('.')[0])
        });
        this.stepFileList = newArr
      },
      error: (err: any) => {
        this.tipsService.responseErrorState(err.status as number)
        // 关闭载入提示
        loadTip.loadingInstance.close();
      },
      complete: () => {
        // 关闭载入提示
        loadTip.loadingInstance.close();
      }
    })
  }
  // 提交数据到执行端
  submit() {
    // 打开载入效果
    this.btnShowLoading = true
    this.tableHttp.postTaskAddData(
      this.projectInfo.executionSideInfo?.ipPort as string,
      this.projectInfo.name,
      this.fileName as string,
      this.args
    ).subscribe({
      next: (data: any) => {
        this.toastService.open({
          value: [{ severity: 'success', summary: '摘要', content: data }],
        })
      },
      error: (err: any) => {
        this.tipsService.responseErrorState(err.status as number)
        // 关闭载入效果
        this.btnShowLoading = false;
        // 这是特俗情况，因为是外部输入，所以需要判断一下是不是未定义
        if (this.modalInstance) {
          this.modalInstance.hide();
        }
      },
      complete: () => {
        // 关闭载入效果
        this.btnShowLoading = false
        if (this.modalInstance) {
          this.modalInstance.hide();
        }
      }
    })
  }
}
