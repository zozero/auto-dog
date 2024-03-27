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
  async addtExecuteInfo(data: ExecuteInfo): Promise<number> {
    return await this.tableAddData(this.oneTable, data);
  }

  // 更新数据
  async updateExecuteInfo(key: number, data: { [keyPath: string]: any }) {
    await this.tableUpdateData(this.oneTable, key, data);
  }

  // 获取所有数据
  async queryAllExecuteInfos() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneTable.toArray();
  }

  // 返回最后一条数据
  async queryExecuteLastInfo(): Promise<ExecuteInfo | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneTable.orderBy('id').last();
  }

  async queryWhereExecuteInfo(dict: { [key: string]: any }): Promise<ExecuteInfo[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneTable.where(dict).sortBy('sort')
  }

  // 删除一条数据
  async deleteExecuteInfo(id: number) {
    await this.oneTable.delete(id);
  }
}
export const executeInfoTable = new ExecuteTableService();