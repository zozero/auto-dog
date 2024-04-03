import { Component, Input, OnInit } from '@angular/core';

import { executionSideTable } from '../../../core/services/dexie-db/execution-side-table.service';
import { simulatorTable } from '../../../core/services/dexie-db/simulator-table.service';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from 'ng-devui/layout';
import { DevUIModule } from 'ng-devui';
import { projectTable } from '../../../core/services/dexie-db/project-table.service';
import { CommonModule } from '@angular/common';
import { ExecutionSideInfo, ProjectInfo, SimulatorInfo } from '../../../core/interface/config-type';

@Component({
  selector: 'app-http-select',
  standalone: true,
  imports: [FormsModule, LayoutModule, DevUIModule, CommonModule],
  templateUrl: './http-select.component.html',
  styleUrl: './http-select.component.scss',
})
export class HttpSelectComponent implements OnInit {
  simulatorInfoList!: SimulatorInfo[];
  executionSideInfoList!: ExecutionSideInfo[];
  @Input() currentProject!: ProjectInfo;

  constructor() {}
  ngOnInit(): void {
    void this.getInfoList();
  }

  // 更新数据
  async getInfoList() {
    this.executionSideInfoList =
      await executionSideTable.queryAllExecutionSideInfos();
    this.simulatorInfoList = await simulatorTable.queryAllSimulatorInfos();
  }
  // 更新配置数据
  async onSelectEditEnd() {
    await projectTable.updateProjectInfo(this.currentProject.id as number, this.currentProject);
  }

  async updateData(rowItem: any, field: string) {
    const data = {
      [field]: rowItem[field],
    };
    await projectTable.updateProjectInfo(rowItem.id as number, data);
  }

  // 设置当前需要传输的网络地址，即执行端地址和模拟器地址
  // async setHttpDatas() {
  //   // console.log('🚀 ~ AppComponent ~ setHttpDatas ~ setHttpDatas:');

  // }
}
