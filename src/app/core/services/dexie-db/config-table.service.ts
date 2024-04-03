import { Injectable } from '@angular/core';

import { DexieDBService } from './dexie-db.service';
import {
  ConfigData,
  ExecutionSideInfo,
  SimulatorInfo,
} from '../../interface/config-type';
import { Table } from 'dexie';

@Injectable({
  providedIn: 'root',
})

// 配置数据表
export class ConfigTableService extends DexieDBService {
  oneTable: Table = this.configDataTable;
  constructor() {
    super();
    // console.log(new Date().toLocaleString('zh-CN'));
  }
  // 初始化配置数据
  async initConfigData() {
    const one = {
      id: 1,
      version: '1.0'
    };
    // 可以原地让它返回为空这样就不需要让整个函数为异步了
    const count = await this.oneTable.count();
    // 如果数据时零条就加入一条数据
    if (!count) {
      await this.addtConfigData(one);
    }
    return one;
  }

  // 添加一条配置数据
  async addtConfigData(data: ConfigData) {
    // data.createTime=new Date().toLocaleString('zh-CN');

    await this.tableAddData(this.oneTable, data);
  }

  // 添加多条配置数据
  async addtConfigDataList(datas: ConfigData[]) {
    await this.tableAddDatas(this.oneTable, datas);
  }

  // 更新数据
  async updateData(
    data:
      | { currentSimulatorInfo: SimulatorInfo }
      | { currentExecutionSideInfo: ExecutionSideInfo }
  ) {
    if (data) {
      await this.oneTable.update(1, data);
    }
  }

  // 返回第一条数据
  async getOneConfigData(): Promise<ConfigData> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneTable.get(1);
  }
}

export const configTable = new ConfigTableService();
