import { Injectable } from '@angular/core';
import { DexieDBService } from './dexie-db.service';
import { Table } from 'dexie';
import { ExecuteResultInfo } from '../../interface/execute-type';

@Injectable({
  providedIn: 'root'
})
export class ExecuteResultTableService extends DexieDBService {

  oneTable: Table = this.executeResultInfoTable;
  constructor() {
    super();
  }

  // 添加一条数据
  async addtExecuteResultInfo(data: ExecuteResultInfo) {
    await this.tableAddData(this.oneTable, data);
  }

  // 更新数据
  async updateExecuteResultInfo(key: number, data: { [keyPath: string]: any }) {
    await this.tableUpdateData(this.oneTable, key, data);
  }

  // 获取所有数据
  async queryAllExecuteResultInfos() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneTable.toArray();
  }

  // 删除一条数据
  async deleteExecuteResultInfo(id: number) {
    await this.oneTable.delete(id);
  }
}
export const executeResultInfoTable = new ExecuteResultTableService();
