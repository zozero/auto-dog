import { ProjectInfo } from './../../../../core/interface/config-type';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormLayout, FormModule } from 'ng-devui/form';
import { FormsModule } from '@angular/forms';
import { InputNumberModule, LoadingService } from 'ng-devui';
import { MatchMethodType, StepTableType, TestStepDataType } from '../../../../core/interface/table-type';
import { TranslateModule } from '@ngx-translate/core';
import { cloneDeep } from 'lodash-es';
import { TableHttpService } from '../../../../core/services/https/table-http.service';
import { defaultBehaviorEncode, defaultDirectionEncode, defaultEncodeObj, defaultStepData, defaultZJEncode } from '../../../../core/mock/step-mock';
import { ModalComponent } from 'ng-devui/modal';
import { SelectModule } from 'ng-devui/select';
import { InputGroupModule } from 'ng-devui/input-group';
import { TooltipModule } from 'ng-devui/tooltip';
import { ButtonModule } from 'ng-devui/button';
import { TipsDialogService } from '../../../../core/services/tips-dialog/tips-dialog.service';
import { MyLocalStorageService } from '../../../../core/services/my-local-storage/my-local-storage.service';
import { ExecutionHttpService } from '../../../../core/services/https/execution-http.service';
import { matchMethodList } from '../../../../core/mock/match-mock';

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


  defaultMethodEncode : MatchMethodType[]= matchMethodList;
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
    private loadingService: LoadingService,
    private myLocalStorage: MyLocalStorageService,
    private executionHttpService: ExecutionHttpService,
  ) {
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
        // 如果自动执行的话就去获取最后的序号
        const tmpStr: string | null = this.myLocalStorage.get('autoExe');
        if (tmpStr != null && Boolean(tmpStr)) {
          this.getLastOrder()
        }

        // 全局提示成功消息
        this.tipsService.globTipsInfo(data as string)
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

  // 获取最后一条数据的序号
  getLastOrder() {
    // 数据载入提示
    const loadTip = this.loadingService.open();
    this.tableHttp.getStepLastOrder(
      this.projectInfo.executionSideInfo?.ipPort as string,
      this.projectInfo.name,
      this.fileName as string
    ).subscribe({
      next: (data: any) => {
        // 去执行测试吧
        this.testStep(data as number);
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
  // 测试数据的可行性
  testStep(order: number) {
    // 打开载入效果
    this.btnShowLoading = true
    // 准备数据
    const stepData: TestStepDataType = {
      模拟器的ip和端口: this.projectInfo.simulatorInfo?.ipPort as string,
      项目名: this.projectInfo.name,
      名称: this.fileName as string,
      编号: order
    }
    this.executionHttpService.postTestStepData(
      this.projectInfo.executionSideInfo?.ipPort as string,
      stepData
    ).subscribe({
      next: (data: any) => {
        // 全局提示成功消息
        this.tipsService.globTipsInfo(data as string)
      },
      error: (err: any) => {
        this.tipsService.responseErrorState(err.status as number)
        // 关闭载入效果
        this.btnShowLoading = false
      },
      complete: () => {
        // 关闭载入效果
        this.btnShowLoading = false
      }
    })
  }
}
