import { Injectable } from '@angular/core';
import { DexieDBService } from './dexie-db.service';
import { Table } from 'dexie';
import { TaskExecuteResultInfo } from '../../interface/execute-type';

@Injectable({
  providedIn: 'root'
})
export class TaskExecuteResultTableService extends DexieDBService {

  oneTable: Table = this.taskExecuteResultInfoTable;
  constructor() {
    super();
  }

  // 添加一条数据
  async addtTaskExecuteResultInfo(data: TaskExecuteResultInfo) {
    await this.tableAddData(this.oneTable, data);
  }

  // 更新数据
  async updateTaskExecuteResultInfo(key: number, data: { [keyPath: string]: any }) {
    await this.tableUpdateData(this.oneTable, key, data);
  }

  // 获取所有数据
  async queryAllTaskExecuteResultInfos() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneTable.toArray();
  }

  // 删除一条数据
  async deleteTaskExecuteResultInfo(id: number) {
    await this.oneTable.delete(id);
  }
}
export const taskExecuteResultInfoTable = new TaskExecuteResultTableService();
