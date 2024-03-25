import { Injectable } from '@angular/core';
import { ToastService } from 'ng-devui';
import { DialogService } from 'ng-devui/modal';

@Injectable({
  providedIn: 'root',
})
export class TipsDialogService {
  config = {
    id: 'dialog-service',
    width: '346px',
    maxHeight: '600px',
    zIndex: 1050,
    backdropCloseable: true,
    html: true,
  };
  constructor(
    private dialogService: DialogService,
    private toastService: ToastService
    ) { }

  // 提示重复出现
  openToEqualDialog(filed: string) {
    const results = this.dialogService.open({
      ...this.config,
      dialogtype: 'failed',
      content: '该<span style="color:red;font:16px both;">' + filed + '</span>已经重复出现，请使用其他的。',
      buttons: [
        {
          cssClass: 'primary',
          text: '确定',
          handler: () => {
            results.modalInstance.hide();
          },
        },
      ],
    });
    return results;
  }

  // 各种请求数据错误提示框
  openErrorDialog(info: string) {
    const config = {
      id: 'dialog-service',
      width: '346px',
      maxHeight: '600px',
      zIndex: 1050,
      backdropCloseable: true,
      html: true,
    };
    const results = this.dialogService.open({
      ...config,
      dialogtype: 'failed',
      content: info,
      buttons: [
        {
          cssClass: 'primary',
          text: '确定',
          handler: () => {
            results.modalInstance.hide();
          },
        },
      ],
    });
  }

  // 响应错误状态提示
  responseErrorState(state:number){
    if(state===0){
      this.openErrorDialog('可能没有开启执行端。')
    }
    else if(state>=400 && state<500){
      this.openErrorDialog('可能没有文件。')

    }else if(state>=500 && state<600){

      this.openErrorDialog('可能执行端出现了问题。')
    }
  }
  // 全局提示成功
  globTipsInfo(info:string){
    this.toastService.open({
      value: [{ severity: 'success', summary: '摘要', content: info }],
    });
  }
}
