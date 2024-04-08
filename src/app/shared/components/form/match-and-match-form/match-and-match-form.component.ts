import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, FormLayout, FormModule, ImagePreviewModule, InputNumberModule, LoadingService, ModalComponent, SelectModule, ToastService } from 'ng-devui';
import { defaultMatchAndMatchMethodArgs } from '../../../../core/mock/match-mock';
import { MatchAndMatchMethodType } from '../../../../core/interface/table-type';
import { cloneDeep } from 'lodash-es';
import { IconModule } from 'ng-devui/icon';
import { InputGroupModule } from 'ng-devui/input-group';
import { TableHttpService } from '../../../../core/services/https/table-http.service';
import { TipsDialogService } from '../../../../core/services/tips-dialog/tips-dialog.service';
import { ProjectInfo } from '../../../../core/interface/config-type';

@Component({
  selector: 'app-match-and-match-form',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    FormsModule,
    SelectModule,
    InputNumberModule,
    ButtonModule,
    TranslateModule,
    IconModule,
    ImagePreviewModule,
    InputGroupModule],
  templateUrl: './match-and-match-form.component.html',
  styleUrl: './match-and-match-form.component.scss'
})
export class MatchAndMatchFormComponent implements OnInit {
  @Input() projectInfo!: ProjectInfo
  @Input() modalInstance!: ModalComponent;
  @Input() modalContentInstance: any;
  // 按钮点击后的载入提示
  btnShowLoading = false;
  // 参数对，初始一个预设的值
  args: MatchAndMatchMethodType = cloneDeep(defaultMatchAndMatchMethodArgs);

  // 表单垂直布局
  vertical: FormLayout = FormLayout.Vertical;
  // 前编码，用来编码表单组合
  beforeEncodeArr: string[] = ['A', '']
  // 前编码，用来编码表单组合
  afterEncodeArr: string[] = ['A', '']
  // 方法编码列表
  methodEncodeList: string[] = ['A', 'B', 'E', 'F']

  constructor(
    private tableHttp: TableHttpService,
    private tipsService: TipsDialogService,
    private loadingService: LoadingService,
    private toastService: ToastService,) {
  }
  ngOnInit(): void {
    this.getLastOrder('图片匹配', '前编码');
    this.getLastOrder('图片匹配', '后编码');
  }
  // 打开或者关闭下拉框
  onChangeValue($event: string, type: '前编码' | '后编码') {
    let name = ''
    if ($event === 'A') {
      name = '图片匹配'
    } else if ($event === 'B') {
      name = '二值图片匹配'
    } else if ($event === 'E') {
      name = '多图匹配'
    } else if ($event === 'F') {
      name = '你只看一次'
    }
    else {
      return;
    }
    this.getLastOrder(name, type);

  }

  // 获取最后一条数据的序号
  getLastOrder(name: string, type: '前编码' | '后编码') {
    // 数据载入提示
    const loadTip = this.loadingService.open();
    this.tableHttp.getMethodLastOrder(
      this.projectInfo.executionSideInfo?.ipPort as string,
      this.projectInfo.name,
      name
    ).subscribe({
      next: (data: any) => {
        if (type === '前编码') {
          this.beforeEncodeArr[1] = data
        } else {
          this.afterEncodeArr[1] = data
        }
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

  // 返回参数
  retArgs() {
    this.args['前编码'] = String(this.beforeEncodeArr[0]) + String(this.beforeEncodeArr[1])
    this.args['后编码'] = String(this.afterEncodeArr[0]) + String(this.afterEncodeArr[1])
    return this.args
  }

  // 提交数据
  submit() {
    this.retArgs();
    this.addCsvData();
  }

  // 向csv表格中添加数据
  addCsvData() {
    // 打开载入效果
    this.btnShowLoading = true
    this.tableHttp
      .postMethodAddData(
        this.projectInfo.executionSideInfo?.ipPort as string,
        this.projectInfo.name,
        '匹配再匹配',
        this.args
      )
      .subscribe({
        next: (data: any) => {
          this.toastService.open({
            value: [{ severity: 'success', summary: '摘要', content: data }],
          })
          // 打开添加步骤的弹出框
          // this.addStepDialog();
        },
        error: (err: any) => {
          this.tipsService.responseErrorState(err.status as number)
          // 关闭载入效果
          this.btnShowLoading = false
          this.modalInstance.hide();
        },
        complete: () => {
          // 关闭载入效果
          this.btnShowLoading = false
          this.modalInstance.hide();
        }
      })
  }
}
