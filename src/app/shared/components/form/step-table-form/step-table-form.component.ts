import { ProjectInfo } from './../../../../core/interface/config-type';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormLayout, FormModule } from 'ng-devui/form';
import { FormsModule } from '@angular/forms';
import { InputNumberModule, ToastService } from 'ng-devui';
import { StepTableType } from '../../../../core/interface/table-type';
import { TranslateModule } from '@ngx-translate/core';
import { cloneDeep } from 'lodash';
import { TableHttpService } from '../../../../core/services/https/table-http.service';
import { defaultBehaviorEncode, defaultDirectionEncode, defaultMethodEncode, defaultStepData, defaultZJEncode } from '../../../../core/mock/step-mock';
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
export class StepTableFormComponent implements OnInit{
  @Input() projectInfo!:ProjectInfo;
  @Input() fileName!:string| number;

  @Input() modalInstance!: ModalComponent;
  @Input() modalContentInstance: any;
  // 输入框组合，各种编码，在提交的时候要重新合成数据
  encodeObj={
    界面编码:['',null],
    方法编码:['',null],
    行为编码:['',null,''],
    动后编码:['',null,'',null],
  }
  defaultMethodEncode=defaultMethodEncode;
  defaultBehaviorEncode=defaultBehaviorEncode;
  defaultDirectionEncode=defaultDirectionEncode
  defaultZJEncode=defaultZJEncode;
  // 参数对，初始一个预设的值
  args: StepTableType = cloneDeep(defaultStepData);

  // 表单垂直布局
  vertical: FormLayout = FormLayout.Vertical; 
  // 按钮点击后的载入提示
  btnShowLoading = false;

  constructor(
    private tableHttp: TableHttpService,
    private tipsService: TipsDialogService,
    private toastService: ToastService) {
  }
  ngOnInit(): void {
    console.log('modalInstance', this.modalInstance);
    console.log('modalContentInstance', this.modalContentInstance);
  }

  submit(){
    this.args['界面编码']=this.encodeObj['界面编码'].join("")
    this.args['方法编码']=this.encodeObj['方法编码'].join("")
    this.args['行为编码']=this.encodeObj['行为编码'].join("")
    this.args['动后编码']=this.encodeObj['动后编码'].join("")
    this.addStepData();
  }
  // 提交数据到执行端
  addStepData(){
      // 打开载入效果
     this.btnShowLoading=true
     this.tableHttp.postStepAddData(
      this.projectInfo.executionSideInfo?.ipPort as string,
      this.projectInfo.name,
      this.fileName as string,
      this.args
     ).subscribe({
      next:(data: any) => {
        this.toastService.open({
          value: [{ severity: 'success', summary: '摘要', content: data }],
        })
      },
      error: (err: any) => {
        if (err.status != 0) {
          this.tipsService.openErrorDialog('未知原因错误')

        }else{
          this.tipsService.openErrorDialog('可能没有开启服务器。')
        }
        // 关闭载入效果
        this.btnShowLoading=false;
        this.modalInstance.hide();
      },
      complete: () => {
        // 关闭载入效果
        this.btnShowLoading=false
        this.modalInstance.hide();
      }
     })
  }
}
