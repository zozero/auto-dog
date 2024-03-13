import { Component } from '@angular/core';
import { ExecutionSideInfo } from '../../config-data';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { executionSideTable } from '../../../core/services/dexie-db/execution-side-table.service';
import { DialogService } from 'ng-devui/modal';

@Component({
  selector: 'app-add-execution-side-info-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-execution-side-info-dialog.component.html',
  styleUrl: './add-execution-side-info-dialog.component.scss'
})
export class AddExecutionSideInfoDialogComponent {
  mydata:ExecutionSideInfo={
    ipPort:'127.0.0.1:5555'
  }
  config = {
    id: 'dialog-service',
    width: '346px',
    maxHeight: '600px',
    zIndex: 1050,
    backdropCloseable: true,
    html: true,
  };
  content = {
    failed: '该“IP:端口”已经重复出现，请使用其他的。',
  };

  constructor(private dialogService: DialogService) {}

  async addData(){
    return await executionSideTable.addtExecutionSideInfo(this.mydata).catch(()=>{
      this.openDialog();
      return 0
    });
  }
  // openDialog(dialogtype?: string) {
  //   const results = this.dialogService.open({
  //     ...this.config,
  //     dialogtype: dialogtype,
  //     content: this.content[dialogtype],
  //     buttons: [
  //       {
  //         cssClass: 'primary',
  //         text: 'Ok',
  //         handler: ($event: Event) => {
  //           results.modalInstance.hide();
  //         },
  //       },
  //     ],
  //   });
  // }
  openDialog() {
    const results = this.dialogService.open({
      ...this.config,
      dialogtype: "failed",
      content: this.content['failed'],
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
