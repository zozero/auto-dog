
import { Component, OnInit } from '@angular/core';
import { ExecutionSideTableComponent } from './execution-side-table/execution-side-table.component';
import { ExecutionSideInfo, ProjectInfo, SimulatorInfo } from '../../core/interface/config-type';
import { SimulatorTableComponent } from "./simulator-table/simulator-table.component";
import { AlertModule } from 'ng-devui/alert';
import { ProjectTableComponent } from "./project-table/project-table.component";
import { LayoutModule } from 'ng-devui';
import { configTable } from '../../core/services/dexie-db/config-table.service';
import { executionSideTable } from '../../core/services/dexie-db/execution-side-table.service';
import { simulatorTable } from '../../core/services/dexie-db/simulator-table.service';
import { projectTable } from '../../core/services/dexie-db/project-table.service';

@Component({
    selector: 'app-config',
    standalone: true,
    templateUrl: './config.component.html',
    styleUrl: './config.component.scss',
    imports: [LayoutModule,ExecutionSideTableComponent, SimulatorTableComponent, AlertModule, ProjectTableComponent]
})
export class ConfigComponent implements OnInit {
  version: string = '';
  executionSideInfoList:ExecutionSideInfo[]=[]
  simulatorInfoList:SimulatorInfo[]=[]
  projectInfoList:ProjectInfo[]=[]
  constructor() {
    
  }
  ngOnInit(): void {
    void this.initData();
    
  }
  // 初始化数据
  async initData(){
    await configTable.initConfigData();

    await executionSideTable.initExecutionSideInfo();
    await simulatorTable.initSimulatorInfo();
    await projectTable.initProjectInfo();

    await this.setVersion();
    await this.getAndSetData();
  }
  // 获取执行侧数据和模拟器数据
  async getAndSetData(){
    // 获取和设置数据
    this.executionSideInfoList=await executionSideTable.queryAllExecutionSideInfos();
    this.simulatorInfoList=await simulatorTable.queryAllSimulatorInfos();
    this.projectInfoList=await projectTable.queryAllProjectInfos();
  }


  // 设置程序版本信息
  async setVersion() {
    const configData = await configTable.configDataTable
      .where({ id: 1 })
      .toArray();
    if (configData.length) {
      this.version = configData[0].version;
    }
  }
}
