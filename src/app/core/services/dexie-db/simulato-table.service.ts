import { Injectable } from '@angular/core';

import { DexieDBService } from './dexie-db.service';
import { SimulatorInfo } from '../../../config/config-data';
// import { SimulatorInfo } from '../../../config/config-data';

@Injectable({
  providedIn: 'root'
})

// 模拟器数据表
export class SimulatorTableService extends DexieDBService  {

  constructor() {
    super();
  }

  
  // 添加一条数据
  async addtExecutionSideInfo(data:SimulatorInfo){
    await this.tableAddData(this.simulatorInfoTable, data);
  }
}

export const simulatorTable = new SimulatorTableService();