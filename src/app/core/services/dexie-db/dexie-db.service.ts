import { Injectable } from '@angular/core';
import Dexie from 'dexie';


@Injectable({
  providedIn: 'root'
})
export class DexieDBService extends Dexie {
  // 一定要先初始u啊数据库后才能查询，而初始往往需要添加一次数据。
  constructor() {
    // 传递数据库的名称
    super('AutoDog');
    
    //   this.on('populate', () => this.populate());
  }
  // 打开数据库
  openDatabase(){
    this.open().catch(err=>{
      console.log(err)
    })
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

  // 初始化表格，先删除表格，后重新打开表格
  async initTable() {
    await this.delete()
    await this.open()
  }

}
