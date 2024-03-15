import { Component } from '@angular/core';
import { ExecutionSideInfo, SimulatorInfo } from '../../../config/config-data';
import { executionSideTable } from '../../../core/services/dexie-db/execution-side-table.service';
import { simulatorTable } from '../../../core/services/dexie-db/simulator-table.service';
import { configTable } from '../../../core/services/dexie-db/config-table.service';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from 'ng-devui/layout';
import { DevUIModule } from 'ng-devui';

@Component({
  selector: 'app-http-select',
  standalone: true,
  imports: [FormsModule,LayoutModule,DevUIModule],
  templateUrl: './http-select.component.html',
  styleUrl: './http-select.component.scss',
})
export class HttpSelectComponent {
  simulatorInfoList!: SimulatorInfo[];
  executionSideInfoList!: ExecutionSideInfo[];
  currentSimulatorInfo!: SimulatorInfo;
  currentExecutionSide!: ExecutionSideInfo;

  // 更新数据
  async selectClickUpdateDatas(type: string) {
    switch (type) {
      case '执行端':
        this.executionSideInfoList =
          await executionSideTable.queryAllExecutionSideInfos();
        break;
      case '模拟器端':
        this.simulatorInfoList = await simulatorTable.queryAllSimulatorInfos();
        break;
      default:
        break;
    }
  }
  // 更新配置数据
  async onSelectEditEnd(type: string) {
    console.log('🚀 ~ AppComponent ~ onSelectEditEnd ~ onSelectEditEnd:');
    switch (type) {
      case '执行端':
        await configTable.updateData({
          currentExecutionSideInfo: this.currentExecutionSide,
        });
        break;
      case '模拟器端':
        await configTable.updateData({
          currentSimulatorInfo: this.currentSimulatorInfo,
        });
        break;
      default:
        await configTable.updateData({
          currentExecutionSideInfo: this.currentExecutionSide,
        });
        await configTable.updateData({
          currentSimulatorInfo: this.currentSimulatorInfo,
        });
        break;
    }
  }

  // 设置当前需要传输的网络地址，即执行端地址和模拟器地址
  async setHttpDatas() {
    console.log('🚀 ~ AppComponent ~ setHttpDatas ~ setHttpDatas:');
    // 获取所有数据
    this.executionSideInfoList =
      await executionSideTable.queryAllExecutionSideInfos();
    this.simulatorInfoList = await simulatorTable.queryAllSimulatorInfos();

    // 判断数据库是否已经存在执行端和模拟器端的数据，是的话读取
    const oneSimulatorInfo = await configTable.getOneConfigData();
    if (
      oneSimulatorInfo?.currentExecutionSideInfo &&
      oneSimulatorInfo?.currentSimulatorInfo
    ) {
      this.currentExecutionSide = oneSimulatorInfo.currentExecutionSideInfo;
      this.currentSimulatorInfo = oneSimulatorInfo.currentSimulatorInfo;
    } else {
      this.currentExecutionSide = this.executionSideInfoList[0];
      this.currentSimulatorInfo = this.simulatorInfoList[0];
      await this.onSelectEditEnd('');
    }
  }
}
