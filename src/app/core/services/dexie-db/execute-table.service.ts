import { Injectable } from '@angular/core';
import { DexieDBService } from './dexie-db.service';
import { Table } from 'dexie';
import { ExecuteInfo } from '../../interface/execute-type';

@Injectable({
  providedIn: 'root'
})
export class ExecuteTableService extends DexieDBService {

  oneTable: Table = this.executeInfoTable;
  constructor() {
    super();
  }

  // 添加一条数据
  async addtProjectInfo(data: ExecuteInfo) {
    await this.tableAddData(this.oneTable, data);
  }

  // 更新数据
  async updateProjectInfo(key: number, data: { [keyPath: string]: any }) {
    await this.tableUpdateData(this.oneTable, key, data);
  }

  // 获取所有数据
  async queryAllExecutionSideInfos() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneTable.toArray();
  }

  // 删除一条数据
  async deleteExecutionSideInfo(id: number) {
    await this.oneTable.delete(id);
  }
}
export const executeInfoTable = new ExecuteTableService();