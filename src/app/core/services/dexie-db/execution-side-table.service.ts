import { Injectable } from '@angular/core';

import { DexieDBService } from './dexie-db.service';
import { ExecutionSideInfo } from '../../../config/config-data';

@Injectable({
  providedIn: 'root'
})
export class ExecutionSideTableService extends DexieDBService {

  constructor() {
    super();
  }
  // 获得数据数量
  async getDataCount(){
    if(!this.isOpen()){
      return 0;
    }
    else{
      return await this.executionSideInfoTable.count();
    }
  }

  // 初始化配置数据
  async initConfigData() {
    const one={
      id: 1,
      ipPort: '127.0.0.1:28888',
    }
    // 可以原地让它返回为空这样就不需要让整个函数为异步了
    const count=await this.executionSideInfoTable.count()
    console.log("🚀 ~ ExecutionSideTableService ~ initConfigData ~ count:", count)
     // 如果数据时零条就加入一条数据
     if (!count) {
      await this.addtExecutionSideInfo(one);
    }
    return one
  }

  // 添加一条数据
  async addtExecutionSideInfo(data:ExecutionSideInfo){
    await this.tableAddData(this.executionSideInfoTable, data);
  }
}

export const executionSideTable = new ExecutionSideTableService();
