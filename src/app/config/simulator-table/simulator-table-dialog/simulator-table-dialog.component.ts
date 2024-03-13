import { Component } from '@angular/core';
import { SimulatorInfo } from '../../config-data';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipsDialogService } from '../../../core/services/tips-dialog/tips-dialog.service';
import { SelectModule } from 'ng-devui/select';
import { simulatorType } from '../simulator-table.component';
import { simulatorTable } from '../../../core/services/dexie-db/simulato-table.service';

@Component({
  selector: 'app-simulator-table-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, SelectModule],
  templateUrl: './simulator-table-dialog.component.html',
  styleUrl: './simulator-table-dialog.component.scss',
})
export class SimulatorTableDialogComponent {
  mydata: SimulatorInfo = {
    ipPort: '127.0.0.1:5555',
    name: '随便',
    type: '安卓',
  };
  simulatorType = simulatorType;

  constructor(private dialogService: TipsDialogService) {}

  async addData() {
    return await simulatorTable
      .addSimulatorInfo(this.mydata)
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
