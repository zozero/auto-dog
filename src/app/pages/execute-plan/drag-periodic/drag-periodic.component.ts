import { ProjectInfo } from './../../../core/interface/config-type';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DragDropModule, DropEvent } from 'ng-devui/dragdrop';
import { LayoutModule } from 'ng-devui';
import { ButtonModule } from 'ng-devui/button';
import { ExecuteInfo, MyDragDropType } from '../../../core/interface/execute-type';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'ng-devui/select';
import { InputNumberModule } from 'ng-devui';
import { executeResultInfoTable } from '../../../core/services/dexie-db/execute-result-table.service';
import { executeInfoTable } from '../../../core/services/dexie-db/execute-table.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-drag-periodic',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    LayoutModule,
    ButtonModule,
    InputNumberModule,
    SelectModule,
  ],
  templateUrl: './drag-periodic.component.html',
  styleUrl: './drag-periodic.component.scss'
})
export class DragPeriodicComponent implements OnInit {
  @Input() projectInfo!: ProjectInfo;
  tmpdata = 1;
  // 任务列表 "下载", "购买", "签到", "快速行动"
  taskList: any[] = [
    {
      原索引: -1,
      数据: "下载",
      选中: false
    },
    {
      原索引: -1,
      数据: "购买",
      选中: false
    },
    {
      原索引: -1,
      数据: "签到",
      选中: false
    },
    {
      原索引: -1,
      数据: "快速行动快速行动啊快速行动快速行动啊快速行动快速行动啊快速行动快速行动啊",
      选中: false
    },
  ]
  // 每天任务列表
  taskListEvery: MyDragDropType[] = [];
  // 每周任务列表
  taskListWeek: MyDragDropType[] = [];
  // 每月任务列表
  taskListMonth: MyDragDropType[] = [];
  // 今天任务列表
  taskListToday: MyDragDropType[] = [];

  constructor(private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    void this.setPeriodicData();
  }

  // 放下
  async onDrop(e: DropEvent, type: string = "") {
    console.log("🚀 ~ DragPeriodicComponent ~ onDrop ~ e:", e)
    if (e.batchDragData && e.batchDragData.length > 1) {
      this.onDropBatch(e, type);
    } else {
      e.dragData['类型'] = type
      const tmpExecuteInfo = await this.addDataTOExecute(e.dragData as MyDragDropType);
      // 不能去修改原始的数据，因为原始数据的类型和数据库数据的类型是不一样的。
      const tmpData: MyDragDropType = cloneDeep(e.dragData)
      tmpData['数据'] = tmpExecuteInfo;
      this.listClassify(type)?.push(tmpData)
    }
  }

  async addDataTOExecute(data: MyDragDropType): Promise<ExecuteInfo> {
    const lastData = await executeInfoTable.queryExecuteLastInfo();
    let sort = 1;
    // 假如没有数据就让排序等于1，有数据就赋值
    if (lastData) {
      sort = lastData['sort'] + 1;
    }
    const tableData: ExecuteInfo = {
      name: data['数据'] as unknown as string,
      projectName: this.projectInfo.name,
      executionDay: 1,
      periodic: data['类型'] as string,
      sort: sort
    }
    tableData['id'] = await executeInfoTable.addtExecuteInfo(tableData)
    return tableData
  }
  // 拖动开始事件
  onDragStart(list: MyDragDropType[], i: number,) {
    console.log("🚀 ~ DragPeriodicComponent ~ onDragStart ~ e:", i)
    list[i]['原索引'] = i;
  }
  // 放下批量数据
  onDropBatch(e: DropEvent, type: string = "") {
    console.log("🚀 ~ DragPeriodicComponent ~ onDropBatch ~ e:", e)
    e.batchDragData.forEach(async (element: MyDragDropType) => {
      element['类型'] = type
      const tmpExecuteInfo = await this.addDataTOExecute(element);
      // 不能去修改原始的数据，因为原始数据的类型和数据库数据的类型是不一样的。
      const tmpData: MyDragDropType = cloneDeep(element)
      tmpData['数据'] = tmpExecuteInfo;
      this.listClassify(type)?.push(tmpData)
    });
  }
  // 获取和设置初始的周期数据
  async setPeriodicData() {
    let type='每天'
    const dataListDay: ExecuteInfo[] = await executeInfoTable.queryWhereExecuteInfo({ 'projectName': this.projectInfo.name, 'periodic': type })
    dataListDay.forEach((data: ExecuteInfo) => {
      this.taskListEvery.push({
        数据: data,
        类型: type
      })
    })

    type='每周'
    const dataListWeek: ExecuteInfo[] = await executeInfoTable.queryWhereExecuteInfo({ 'projectName': this.projectInfo.name, 'periodic': type })
    dataListWeek.forEach((data: ExecuteInfo) => {
      this.taskListWeek.push({
        数据: data,
        类型: type
      })
    })

    type='每月'
    const dataLisMonth: ExecuteInfo[] = await executeInfoTable.queryWhereExecuteInfo({ 'projectName': this.projectInfo.name, 'periodic': type })
    dataLisMonth.forEach((data: ExecuteInfo) => {
      this.taskListMonth.push({
        数据: data,
        类型: type
      })
    })
  }
  // 列表分类，用于返回不同类型的列表对象
  listClassify(type: string) {
    switch (type) {
      case '每天': {
        return this.taskListEvery
      }
      case '每周': {
        return this.taskListWeek
      }
      case '每月': {
        return this.taskListMonth
      }
      case '今日': {
        return this.taskListToday
      }
    }
  }

  // 放下 删除
  onDropDelete(e: DropEvent) {
    console.log("🚀 ~ DragPeriodicComponent ~ onDropDelete ~ e:", e)
    const data: ExecuteInfo = e.dragData['数据'] as ExecuteInfo
    void executeInfoTable.deleteExecuteInfo(data['id'] as number);
    this.listClassify(e.dragData['类型'] as string)?.splice(e.dragData['原索引'] as number, 1)
  }

  // 原数据批量选中
  onBatchSelectRaw(item: MyDragDropType) {
    item['选中'] = !(item['选中'] || false);
    // this.cdr.detectChanges();
  }

  onDropToday(e: DropEvent, list: MyDragDropType[]) {
    console.log("🚀 ~ DragPeriodicComponent ~ onDropToday ~ e:", e)
    const oldIndex = e.dragFromIndex;
    let newIndex = e.dropIndex;

    if (oldIndex !== undefined && newIndex !== undefined && newIndex !== -1) {
      /* 修正同一个container排序，往下拖动index多了1个位置*/
      if (oldIndex !== -1 && newIndex > oldIndex) {
        newIndex--;
      }
      list.splice(newIndex, 0, oldIndex === -1 ? e.dragData as MyDragDropType : list.splice(oldIndex, 1)[0]);
    } else {
      void this.onDrop(e, '今日');
    }
  }

  // 原数据批量选中检查
  onBatchSelectRawCheck(event: MouseEvent, item: MyDragDropType) {
    console.log("🚀 ~ DragPeriodicComponent ~ onBatchSelectCheck ~ event:", event)
    // 如果按了ctrl键就执行
    if (event.ctrlKey) {
      this.onBatchSelectRaw(item);
    }
  }

  // 修改执行日数据
  async onChangeExecutionDay(e:number,id:number|undefined){
    await executeInfoTable.updateExecuteInfo(id as number,{'executionDay':e});
  }

}
