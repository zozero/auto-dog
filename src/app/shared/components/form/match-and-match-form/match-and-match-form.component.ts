import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormLayout, FormModule, ImagePreviewModule, InputNumberModule, LoadingService, SelectModule } from 'ng-devui';
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
    TranslateModule,
    IconModule,
    ImagePreviewModule,
    InputGroupModule],
  templateUrl: './match-and-match-form.component.html',
  styleUrl: './match-and-match-form.component.scss'
})
export class MatchAndMatchFormComponent implements OnInit {
  @Input() projectInfo!: ProjectInfo
  // 参数对，初始一个预设的值
  args: MatchAndMatchMethodType = cloneDeep(defaultMatchAndMatchMethodArgs);

  // 表单垂直布局
  vertical: FormLayout = FormLayout.Vertical;
  // 用来编码表单组合
  encodeArr: string[] = ['A', '']
  // 

  constructor(
    private tableHttp: TableHttpService,
    private tipsService: TipsDialogService,
    private loadingService: LoadingService,) {
  }
  ngOnInit(): void {
    // console.log("BinaryImageMatchFormComponent");
    this.getLastOrder('图片匹配');
  }

  // 打开或者关闭下拉框
  onChangeValue($event: boolean) {
     if ($event) {
      let name = ''
      if (this.encodeArr[0] === 'A') {
        name = '图片匹配'
      } else if (this.encodeArr[0] === 'B') {
        name = '二值图片匹配'
      }
      else {
        return;
      }

      this.getLastOrder(name);
    }
  }

  // 获取最后一条数据的序号
  getLastOrder(name: string) {
    // 数据载入提示
    const loadTip = this.loadingService.open();
    this.tableHttp.getMethodLastOrder(
      this.projectInfo.executionSideInfo?.ipPort as string,
      this.projectInfo.name,
      name
    ).subscribe({
      next: (data: any) => {
        this.encodeArr[1] = data
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
  retArgs(){
    this.args['编码']=String(this.encodeArr[0])+String(this.encodeArr[1])
    return this.args
  }
}
