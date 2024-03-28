import { Component } from '@angular/core';
import {
  ExecutionSideInfo,
  ProjectInfo,
  SimulatorInfo,
} from '../../../../core/interface/config-type';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng-devui/select';
import { InputGroupModule } from 'ng-devui/input-group';
import { DevUIModule } from 'ng-devui';
import { cloneDeep } from 'lodash-es';
import { TipsDialogService } from '../../../../core/services/tips-dialog/tips-dialog.service';
import { projectTable } from '../../../../core/services/dexie-db/project-table.service';
import { executionSideTable } from '../../../../core/services/dexie-db/execution-side-table.service';
import { simulatorTable } from '../../../../core/services/dexie-db/simulator-table.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-project-table-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    InputGroupModule,
    DevUIModule,
  ],
  templateUrl: './add-project-table-dialog.component.html',
  styleUrl: './add-project-table-dialog.component.scss',
})
export class AddProjectTableDialogComponent {
  // 强制初始一次数据防止报错
  mydata!: ProjectInfo;

  executionSideInfoList!: ExecutionSideInfo[];
  simulatorInfoList!: SimulatorInfo[];

  constructor(private dialogService: TipsDialogService) {
    void this.setInitData();
  }

  async setInitData() {
    this.mydata = await projectTable.queryProjectLastInfo();
    delete this.mydata.id;

    this.executionSideInfoList =
      await executionSideTable.queryAllExecutionSideInfos();

    this.mydata.executionSideInfo =
      this.executionSideInfoList[this.executionSideInfoList.length - 1];
    this.simulatorInfoList = await simulatorTable.queryAllSimulatorInfos();

    this.mydata.simulatorInfo =
      this.simulatorInfoList[this.simulatorInfoList.length - 1];
    console.log(
      '🚀 ~ AddProjectTableDialogComponent ~ setInitData ~ this.mydata:',
      this.mydata
    );
  }

  async addData() {
    return await projectTable
      .addtProjectInfo(cloneDeep(this.mydata))
      .catch((err) => {
        console.log(
          '🚀 ~ AddProjectTableDialogComponent ~ addData ~ err:',
          err
        );
        console.log(
          '🚀 ~ AddProjectTableDialogComponent ~ addData ~ this.mydata:',
          this.mydata
        );
        this.dialogService.openToEqualDialog('名称');
        return 0;
      });
  }
}
