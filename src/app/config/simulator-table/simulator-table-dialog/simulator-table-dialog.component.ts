import { Component } from '@angular/core';
import { SimulatorInfo } from '../../config-data';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipsDialogService } from '../../../core/services/tips-dialog/tips-dialog.service';
import { SelectModule } from 'ng-devui/select';
import { simulatorTable } from '../../../core/services/dexie-db/simulator-table.service';
import { InputGroupModule } from 'ng-devui/input-group';
import { DevUIModule } from 'ng-devui';
import {
  defaultSimulatorInfo,
  simulatorType,
} from '../../../shared/mock-data/config-mock';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-simulator-table-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    InputGroupModule,
    DevUIModule,
  ],
  templateUrl: './simulator-table-dialog.component.html',
  styleUrl: './simulator-table-dialog.component.scss',
})
export class SimulatorTableDialogComponent {
  mydata: SimulatorInfo = defaultSimulatorInfo;
  simulatorType = simulatorType;

  constructor(private dialogService: TipsDialogService) {
    void this.setInitData();
  }

  async setInitData() {
    this.mydata = await simulatorTable.querySimulatorLastInfo();
    delete this.mydata.id;
  }

  async addData() {
    return await simulatorTable
      .addSimulatorInfo(cloneDeep(this.mydata))
      .catch((err: any) => {
        const filed = this.matchFile(err.message as string);
        switch (filed) {
          case 'ipPort':
            this.dialogService.openToEqualDialog('ip:端口');
            break;
          case 'name':
            this.dialogService.openToEqualDialog('名称');
            break;
          default:
            break;
        }
        // this.openDialog();
        return 0;
      });
  }

  // 判断错误信息具体是哪一个
  matchFile(text: string) {
    let filed = '';
    const result = new RegExp("'[a-zA-Z0-9]+'", 'g').exec(text);
    if (result?.length) {
      const result2 = new RegExp('[a-zA-Z0-9]+', 'g').exec(result[0]);
      if (result2?.length) {
        filed = result2[0];
      }
    }
    return filed;
  }
}
