import { executionSideTable } from './../core/services/dexie-db/execution-side-table.service';
import { Component, OnInit } from '@angular/core';
import { configTable } from '../core/services/dexie-db/config-table.service';
import { ExecutionSideTableComponent } from './execution-side-table/execution-side-table.component';
import { ExecutionSideInfo, SimulatorInfo } from './config-data';
import { simulatorTable } from '../core/services/dexie-db/simulato-table.service';
import { SimulatorTableComponent } from "./simulator-table/simulator-table.component";;
import { AlertModule } from 'ng-devui/alert';

@Component({
    selector: 'app-config',
    standalone: true,
    templateUrl: './config.component.html',
    styleUrl: './config.component.scss',
    imports: [ExecutionSideTableComponent, SimulatorTableComponent,AlertModule]
})
export class ConfigComponent implements OnInit {
  version: string = '';
  executionSideInfoList:ExecutionSideInfo[]=[]
  simulatorInfoList:SimulatorInfo[]=[]
  constructor() {
    
  }
  ngOnInit(): void {
    void this.initData();
    
  }
  // 初始化数据
  async initData(){
    await this.setVersion();
    await executionSideTable.initExecutionSideInfo();
    await simulatorTable.initSimulatorInfo();

    await this.getAndSetData();
  }
  // 获取执行侧数据和模拟器数据
  async getAndSetData(){
    // 获取和设置数据
    this.executionSideInfoList=await executionSideTable.queryAllExecutionSideInfos();
    this.simulatorInfoList=await simulatorTable.querySimulatorLastInfo();
  }


  // 设置程序版本信息
  async setVersion() {
    await configTable.initConfigData();
    const configData = await configTable.configDataTable
      .where({ id: 1 })
      .toArray();
    if (configData.length) {
      this.version = configData[0].version;
    }
  }
}
