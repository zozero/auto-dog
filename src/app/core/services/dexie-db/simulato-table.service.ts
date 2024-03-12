import { Injectable } from '@angular/core';
import { Table } from 'dexie';

import { DexieDBService } from './dexie-db.service';
import { SimulatorInfo } from '../../../config/config-data';

@Injectable({
  providedIn: 'root'
})

// 模拟器数据表
export class SimulatorTableService extends DexieDBService  {
  simulatorInfoTable!: Table<SimulatorInfo, number>;

  constructor() {
    super();
  }
}

export const simulatorTable = new SimulatorTableService();