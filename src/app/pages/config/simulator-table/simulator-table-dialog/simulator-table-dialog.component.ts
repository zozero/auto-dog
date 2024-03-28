import { Component } from '@angular/core';
import { SimulatorInfo } from '../../../../core/interface/config-type';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng-devui/select';
import { InputGroupModule } from 'ng-devui/input-group';
import { DevUIModule } from 'ng-devui';

import { cloneDeep } from 'lodash-es';
import { defaultSimulatorInfo, simulatorType } from '../../../../core/mock/config-mock';
import { TipsDialogService } from '../../../../core/services/tips-dialog/tips-dialog.service';
import { simulatorTable } from '../../../../core/services/dexie-db/simulator-table.service';
import { CheckConfigService } from '../../../../core/services/checks/check-config.service';

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

  constructor(
    private dialogService: TipsDialogService,
    private check: CheckConfigService
  ) {
    void this.setInitData();
  }

  async setInitData() {
    this.mydata = await simulatorTable.querySimulatorLastInfo();
    delete this.mydata.id;
  }

  async addData() {
    // 如果没有通过检查就返回
    const result = this.check.checkPort(this.mydata.ipPort)
    if (!result.state) {
      this.dialogService.openErrorDialog(result.tip);
      return 0
    } else {
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
