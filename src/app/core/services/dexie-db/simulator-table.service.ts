import { Injectable } from '@angular/core';

import { DexieDBService } from './dexie-db.service';
import { SimulatorInfo } from '../../interface/config-type';
import { Table } from 'dexie';
import { defaultSimulatorInfo } from '../../mock/config-mock';

@Injectable({
  providedIn: 'root'
})

// 模拟器数据表
export class SimulatorTableService extends DexieDBService  {
  oneTable:Table =this.simulatorInfoTable;
  constructor() {
    super();
  }
  // 初始化配置数据
  async initSimulatorInfo() {
    // 可以原地让它返回为空这样就不需要让整个函数为异步了
    // const count=await this.getDataCount(this.executionSideInfoTable);
    const count=await this.oneTable.count();
    console.log("🚀 ~ ExecutionSideTableService ~ initConfigData ~ count:", defaultSimulatorInfo)
     // 如果数据时零条就加入一条数据
     if (!count) {
      await this.addSimulatorInfo(defaultSimulatorInfo);
    }
    return defaultSimulatorInfo
  }

  // 添加一条数据
  async addSimulatorInfo(data:SimulatorInfo){
    await this.tableAddData(this.oneTable, data);
  }

  // 更新一条数据
  async updateSimulatorInfo(key:number,data:{ [keyPath: string]: any}){
    await this.tableUpdateData(this.oneTable,key,data);
  }

  // 返回第一条数据
  async querySimulatorFirstInfo(){
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneTable.orderBy('id').first();
  }

  // 返回最后一条数据
  async querySimulatorLastInfo(){
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneTable.orderBy('id').last();
  }

  // 获取所有数据
  async queryAllSimulatorInfos(){
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneTable.toArray();
  }
  
  // 删除一条数据
  async deleteSimulatorInfo(id:number){
    await this.oneTable.delete(id);
  }
}

export const simulatorTable = new SimulatorTableService();