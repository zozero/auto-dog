import { Component } from '@angular/core';
import { ExecutionSideInfo } from '../../config-data';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { executionSideTable } from '../../../core/services/dexie-db/execution-side-table.service';
import { TipsDialogService } from '../../../core/services/tips-dialog/tips-dialog.service';
import { DevUIModule } from 'ng-devui';
import { defaultExecutionSideInfo } from '../../../shared/mock-data/config-mock';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-add-execution-side-info-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DevUIModule],
  templateUrl: './add-execution-side-info-dialog.component.html',
  styleUrl: './add-execution-side-info-dialog.component.scss',
})
export class AddExecutionSideInfoDialogComponent {
  mydata: ExecutionSideInfo = defaultExecutionSideInfo;

  constructor(private dialogService: TipsDialogService) {
    void this.setInitData();
  }

  async setInitData() {
    this.mydata = await executionSideTable.queryExecutionSideLastInfo();
    delete this.mydata.id;
  }

  async addData() {
    return await executionSideTable
      .addtExecutionSideInfo(cloneDeep(this.mydata))
      .catch((err) => {
        console.log(
          '🚀 ~ AddExecutionSideInfoDialogComponent ~ addData ~ err:',
          err
        );
        this.openDialog();
        return 0;
      });
  }

  openDialog() {
    this.dialogService.openToEqualDialog('ip:端口');
  }
}
