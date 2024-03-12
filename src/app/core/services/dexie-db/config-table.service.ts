import { Injectable } from '@angular/core';
import { Table } from 'dexie';

import { DexieDBService } from './dexie-db.service';
import { ConfigData } from '../../../config/config-data';

@Injectable({
  providedIn: 'root',
})

// 配置数据表
export class ConfigTableService extends DexieDBService {
  configDataTable!: Table<ConfigData, number>;

  constructor() {
    super();
    this.version(1).stores({
      configDataTable: '++id,createTime',
    });

  }
  // 初始化配置数据
  async initConfigData() {
    const one={
      id: 1,
      version: '1.0',
    }
    // 可以原地让它返回为空这样就不需要让整个函数为异步了
    const count=await this.configDataTable.count()
     // 如果数据时零条就加入一条数据
     if (!count) {
      await this.addtConfigData(one);
    }
    return one
  }

  // 添加一条配置数据
  async addtConfigData(data: ConfigData) {
    await this.configDataTable.add(data);
  }

  // 添加多条配置数据
  async addtConfigDataList(datas: ConfigData[]) {
    await this.configDataTable.bulkAdd(datas);
  }

}

export const configTable = new ConfigTableService();
