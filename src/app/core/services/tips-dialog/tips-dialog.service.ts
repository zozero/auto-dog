import { Injectable } from '@angular/core';
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
  constructor(private dialogService: DialogService) {}

  // 提示重复出现
  openToEqualDialog(filed:string) {
    const results = this.dialogService.open({
      ...this.config,
      dialogtype: 'failed',
      content: '该<span style="color:red;font:16px both;">'+filed+'</span>已经重复出现，请使用其他的。',
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
}
