import { ProjectInfo } from './../../../../core/interface/config-type';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormLayout, FormModule } from 'ng-devui/form';
import { FormsModule } from '@angular/forms';
import { InputNumberModule, ToastService } from 'ng-devui';
import { StepTableType } from '../../../../core/interface/table-type';
import { TranslateModule } from '@ngx-translate/core';
import { cloneDeep } from 'lodash';
import { TableHttpService } from '../../../../core/services/https/table-http.service';
import { defaultBehaviorEncode, defaultDirectionEncode, defaultEncodeObj, defaultMethodEncode, defaultStepData, defaultZJEncode } from '../../../../core/mock/step-mock';
import { ModalComponent } from 'ng-devui/modal';
import { SelectModule } from 'ng-devui/select';
import { InputGroupModule } from 'ng-devui/input-group';
import { TooltipModule } from 'ng-devui/tooltip';
import { ButtonModule } from 'ng-devui/button';
import { TipsDialogService } from '../../../../core/services/tips-dialog/tips-dialog.service';

@Component({
  selector: 'app-step-table-form',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    FormsModule,
    InputNumberModule,
    SelectModule,
    InputGroupModule,
    TooltipModule,
    ButtonModule,
    TranslateModule,],
  templateUrl: './step-table-form.component.html',
  styleUrl: './step-table-form.component.scss'
})
export class StepTableFormComponent {
  @Input() projectInfo!: ProjectInfo;
  @Input() fileName!: string | number;

  @Input() modalInstance!: ModalComponent;
  @Input() modalContentInstance: any;
  @Output() dialogClose: EventEmitter<any> = new EventEmitter();
  // 参数对，初始一个预设的值
  @Input() args: StepTableType = cloneDeep(defaultStepData);
  // 输入框组合，各种编码，在提交的时候要重新合成数据
  @Input() encodeObj = defaultEncodeObj
  defaultMethodEncode = defaultMethodEncode;
  defaultBehaviorEncode = defaultBehaviorEncode;
  defaultDirectionEncode = defaultDirectionEncode
  defaultZJEncode = defaultZJEncode;

  // 表单垂直布局
  vertical: FormLayout = FormLayout.Vertical;
  // 按钮点击后的载入提示
  btnShowLoading = false;

  constructor(
    private tableHttp: TableHttpService,
    private tipsService: TipsDialogService,
    private toastService: ToastService) {
  }
  // 提交数据
  submit() {
    this.args['界面编码'] = this.encodeObj['界面编码'].join("")
    this.args['方法编码'] = this.encodeObj['方法编码'].join("")
    this.args['行为编码'] = this.encodeObj['行为编码'].join("")
    this.args['动后编码'] = this.encodeObj['动后编码'].join("")
    this.addStepData();
  }
  // 提交数据到执行端
  addStepData() {
    // 打开载入效果
    this.btnShowLoading = true
    this.tableHttp.postStepAddData(
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

        // 如果有外部对话框的话，发送执行关闭外部对话框
        this.dialogClose.emit(null);
      },
      complete: () => {
        // 关闭载入效果
        this.btnShowLoading = false
        if (this.modalInstance) {
          this.modalInstance.hide();
        }
        // 如果有外部对话框的话，发送执行关闭外部对话框
        this.dialogClose.emit(null);
      }
    })
  }
}
