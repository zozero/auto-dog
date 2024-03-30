import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import {
  ConfigData,
  ExecutionSideInfo,
  ProjectInfo,
  SimulatorInfo,
} from '../../interface/config-type';
import { TaskExecuteInfo, TaskExecuteResultInfo } from '../../interface/execute-type';

@Injectable({
  providedIn: 'root',
})
export class DexieDBService extends Dexie {
  // 一定要先初始化数据库后才能查询，而初始往往需要添加一次数据。
  // 如果数据库存在那么它不在执行自创建数据表。
  configDataTable!: Table<ConfigData, number>;
  executionSideInfoTable!: Table<ExecutionSideInfo, number>;
  simulatorInfoTable!: Table<SimulatorInfo, number>;
  projectInfoTable!: Table<ProjectInfo, number>;
  executeInfoTable!: Table<TaskExecuteInfo, number>;
  taskExecuteResultInfoTable!: Table<TaskExecuteResultInfo, number>;

  constructor() {
    // 传递数据库的名称
    super('AutoDog');
    this.version(2.2).stores({
      configDataTable: '++id,createTime,updateTime',
      executionSideInfoTable: '++id,&ipPort,updateTime,createTime',
      simulatorInfoTable: '++id,&name,&ipPort,type,updateTime,createTime',
      projectInfoTable: '++id,&name,updateTime,createTime',
      executeInfoTable: '++id,name,[projectName+periodic],sort,projectName,updateTime,createTime',
      taskExecuteResultInfoTable: '++id,sort,[projectName+status+createTime],[projectName+createTime],projectName,projectId,executeSideIpPort,simulatorInfoIpPort,start,end,status,updateTime,createTime',
    });

    //   this.on('populate', () => this.populate());
  }
  // 打开数据库
  async openDatabase() {
    await this.open();
  }
  // 填充初始数据
  async populate() {
    // const todoListId = await db.items.add({
    //   title: 'To Do Today',
    // });
  }

  // async dateQueryData(startDate: Date, endDate: Date) {
  // new Date('2023/03/01'),new Date('2023/03/04')
  // return historyDB.historyTable.where('dateTime').between(startDate, endDate)
  // }
  async tableAddData(table: Table, data: any):Promise<number> {
    const currentDate=new Date();
    data.createTime =currentDate;
    data.updateTime = currentDate;
    return await table.add(data) as number;
    
  }

  async tableAddDatas(table: Table, datas: any[]) {
    for (let i = 0; i < datas.length; ++i) {
      const currentDate=new Date();
      datas[i].createTime = currentDate;
      datas[i].updateTime = currentDate;
    }
    await table.bulkAdd(datas);
  }

  async tableUpdateData(table: Table, key: number,data:{ [keyPath: string]: any}){
    const currentDate=new Date();
    data.updateTime = currentDate;
    await table.update(key,data);
  }

  // 初始化表格，先删除表格，后重新打开表格
  async initTable() {
    await this.delete();
    await this.open();
  }
}
