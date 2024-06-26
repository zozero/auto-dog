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
  async addtTaskExecuteResultInfo(data: TaskExecuteResultInfo): Promise<number> {
    return await this.tableAddData(this.oneTable, data);
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

  // 获取某项目今日的所有数据
  async queryAllProjectTaskExecuteResultInfos(xiao: any[], da: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneTable.where(['projectName', 'createTime']).between(xiao, da, true, true).sortBy('sort');
  }


  // 返回最后一条数据
  async queryTaskExecuteResultLastInfo() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneTable.orderBy('id').last();
  }

  // 返回某项目最后一条数据
  async queryProjectTaskExecuteResultLastInfo(projectName: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneTable.where({ projectName: projectName }).last();
  }

  // 当前项目中结果列表
  async queryProjectTaskResultInfos(projectName: string): Promise<TaskExecuteResultInfo[]> {
    return await this.oneTable.where('projectName').equals(projectName).reverse().toArray() as TaskExecuteResultInfo[];
  }

  // 当前项目中结果数量
  async queryProjectTaskResultCount(projectName: string): Promise<number> {
    return await this.oneTable.where('projectName').equals(projectName).count();
  }

  // 删除一条数据
  async deleteTaskExecuteResultInfo(id: number) {
    await this.oneTable.delete(id);
  }

  // 清空表格
  async clearTable() {
    await this.oneTable.clear()
  }
}
export const taskExecuteResultInfoTable = new TaskExecuteResultTableService();
