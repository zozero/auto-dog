import { Injectable } from '@angular/core';
import { DexieDBService } from './dexie-db.service';
import { Table } from 'dexie';
import { defaultProjectData } from '../../../shared/mock-data/config-mock';
import { ProjectInfo } from '../../../config/config-data';

@Injectable({
  providedIn: 'root',
})
export class ProjectTableService extends DexieDBService {
  oneTable: Table = this.projectInfoTable;
  constructor() {
    super();
  }

  // 初始化配置数据
  async initProjectInfo() {
    // 可以原地让它返回为空这样就不需要让整个函数为异步了
    // const count=await this.getDataCount(this.executionSideInfoTable);
    const count = await this.oneTable.count();
    // 如果数据时零条就加入一条数据
    if (!count) {
      await this.addtProjectInfo(defaultProjectData);
    }
  }

  // 添加一条数据
  async addtProjectInfo(data: ProjectInfo) {
    await this.tableAddData(this.oneTable, data);
  }
  // 更新数据
  async updateProjectInfo(key: number, data: { [keyPath: string]: any }) {
    await this.tableUpdateData(this.oneTable, key, data);
  }
  // 返回第一条数据
  async queryProjectFirstInfo() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneTable.orderBy('id').first();
  }

  // 返回最后一条数据
  async queryProjectLastInfo() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneTable.orderBy('id').last();
  }

  // 获取所有数据
  async queryAllProjectInfos() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneTable.toArray();
  }

  // 删除一条数据
  async deleteProjectInfo(id: number) {
    await this.oneTable.delete(id);
  }
}

export const projectTable = new ProjectTableService();
