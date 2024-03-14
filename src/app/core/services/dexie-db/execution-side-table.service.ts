import { Injectable } from '@angular/core';

import { DexieDBService } from './dexie-db.service';
import { ExecutionSideInfo } from '../../../config/config-data';
import { Table } from 'dexie';

@Injectable({
  providedIn: 'root',
})
export class ExecutionSideTableService extends DexieDBService {
  oneTable: Table = this.executionSideInfoTable;
  constructor() {
    super();
  }

  // 初始化配置数据
  async initExecutionSideInfo() {
    const one = {
      id: 1,
      ipPort: '127.0.0.1:28888',
    };
    // 可以原地让它返回为空这样就不需要让整个函数为异步了
    // const count=await this.getDataCount(this.executionSideInfoTable);
    const count = await this.oneTable.count();
    // 如果数据时零条就加入一条数据
    if (!count) {
      await this.addtExecutionSideInfo(one);
    }
  }

  // 添加一条数据
  async addtExecutionSideInfo(data: ExecutionSideInfo) {
    await this.tableAddData(this.oneTable, data);
  }

  // 更新一条数据
  async updateExecutionSideInfo(key: number, data: { [keyPath: string]: any }) {
    await this.tableUpdateData(this.oneTable, key, data);
  }

  // 返回第一条数据
  async queryExecutionSideFirstInfo(){
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneTable.orderBy('id').first();
  }

  // 返回最后一条数据
  async queryExecutionSideLastInfo(){
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneTable.orderBy('id').last();
  }

  // 获取所有数据
  async queryAllExecutionSideInfos(){
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneTable.toArray();
  }

  // 删除一条数据
  async deleteExecutionSideInfo(id:number){
    await this.oneTable.delete(id);
  }
}

export const executionSideTable = new ExecutionSideTableService();
