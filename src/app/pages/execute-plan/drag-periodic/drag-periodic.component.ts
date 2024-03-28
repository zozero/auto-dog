import { ProjectInfo } from './../../../core/interface/config-type';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DragDropModule, DropEvent } from 'ng-devui/dragdrop';
import { LayoutModule, LoadingService } from 'ng-devui';
import { ButtonModule } from 'ng-devui/button';
import { TaskExecuteInfo, MyDragDropType, TaskExecuteResultInfo } from '../../../core/interface/execute-type';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'ng-devui/select';
import { InputNumberModule } from 'ng-devui';
import { executeInfoTable } from '../../../core/services/dexie-db/execute-table.service';
import { cloneDeep, findIndex } from 'lodash-es';
import { getDay, getDate } from 'date-fns';
import { from, filter } from 'rxjs';
import { TableHttpService } from '../../../core/services/https/table-http.service';
import { TipsDialogService } from '../../../core/services/tips-dialog/tips-dialog.service';
import { taskExecuteResultInfoTable } from '../../../core/services/dexie-db/task-execute-result-table.service';
import { BadgeModule } from 'ng-devui/badge';

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
    BadgeModule
  ],
  templateUrl: './drag-periodic.component.html',
  styleUrl: './drag-periodic.component.scss',
  // encapsulation: ViewEncapsulation.None 
})
export class DragPeriodicComponent implements OnInit, OnChanges {
  @Input() projectInfo!: ProjectInfo;
  tmpdata = 1;
  // 任务列表 "下载", "购买", "签到", "快速行动"
  taskList: any[] = []
  // 每天任务列表
  taskListEvery: MyDragDropType[] = [];
  // 每周任务列表
  taskListWeek: MyDragDropType[] = [];
  // 每月任务列表
  taskListMonth: MyDragDropType[] = [];
  // 今天任务列表
  taskListToday: TaskExecuteResultInfo[] = [];
  // taskListToday:any[] = [];

  constructor(
    private loadingService: LoadingService,
    private tableHttp: TableHttpService,
    private tipsDialog: TipsDialogService,
  ) { }
  ngOnInit(): void {
    console.log("DragPeriodicComponent")
  }
  // 自动监听到改变事件后执行
  ngOnChanges(changes: SimpleChanges) {
    if ('projectInfo' in changes) {
      void this.setInitData();
    }

  }
  // 设置初始的数据
  async setInitData() {
    // 清空原先的数据
    this.taskList = [];
    this.taskListEvery = []
    this.taskListWeek = []
    this.taskListMonth = []
    this.taskListToday = []
    // 获得任务列表
    this.getRawTaskList();
    // 设置数据库周期分类的数据
    await this.setPeriodicData();
  }
  // 获取原生的任务列表
  getRawTaskList() {
    // 数据载入提示
    const loadTip = this.loadingService.open();
    this.tableHttp.getTaskCsvFileList(
      this.projectInfo.executionSideInfo?.ipPort as string,
      this.projectInfo.name
    ).subscribe({
      next: (data: any) => {
        // eslint-disable-next-line prefer-const
        let newArr: any[] = []
        data.forEach((el: string) => {
          newArr.push({
            原索引: -1,
            数据: el.split('.')[0],
            选中: false
          })
        });
        this.taskList = newArr;
      },
      error: (err: any) => {
        this.tipsDialog.responseErrorState(err.status as number)
        // 关闭载入提示
        loadTip.loadingInstance.close();
      },
      complete: () => {
        // 关闭载入提示
        loadTip.loadingInstance.close();
      }
    })
  }
  // 放下
  async onDrop(e: DropEvent, type: string = "") {
    if (e.batchDragData && e.batchDragData.length > 1) {
      await this.onDropBatch(e, type);
    } else {
      e.dragData['类型'] = type
      const tmpExecuteInfo = await this.addDataToExecute(e.dragData as MyDragDropType);
      // 不能去修改原始的数据，因为原始数据的类型和数据库数据的类型是不一样的。
      const tmpData: MyDragDropType = cloneDeep(e.dragData);
      tmpData['数据'] = tmpExecuteInfo;
      this.listClassify(type)?.push(tmpData);
      // 这里是判断新的任务是否可以直接加入今日任务列表的。
      this.addTodayItem(tmpExecuteInfo);
    }
  }

  // 添加数据到执行表中
  async addDataToExecute(data: MyDragDropType): Promise<TaskExecuteInfo> {
    const lastData = await executeInfoTable.queryExecuteLastInfo();
    let sort = 1;
    // 假如没有数据就让排序等于1，有数据就赋值
    if (lastData) {
      sort = lastData['sort'] + 1;
    }
    const tableData: TaskExecuteInfo = {
      name: data['数据'] as unknown as string,
      projectName: this.projectInfo.name,
      executionDay: 1,
      periodic: data['类型'] as string,
      sort: sort
    }
    console.log("tableData", tableData)
    tableData['id'] = await executeInfoTable.addtExecuteInfo(tableData)
    return tableData
  }

  // 拖动开始事件
  onDragStart(list: MyDragDropType[], i: number, type: string) {
    list[i]['原索引'] = i;
    list[i]['类型'] = type;
  }
  // 放下批量数据
  async onDropBatch(e: DropEvent, type: string = "") {
    const listData: MyDragDropType[] = e.batchDragData
    for (let i = 0; i < listData.length; i++) {
      listData[i]['类型'] = type
      const tmpExecuteInfo = await this.addDataToExecute(listData[i]);

      // 不能去修改原始的数据，因为原始数据的类型和数据库数据的类型是不一样的。
      const tmpData: MyDragDropType = cloneDeep(listData[i]);
      tmpData['数据'] = tmpExecuteInfo;
      this.listClassify(type)?.push(tmpData)
      this.addTodayItem(tmpExecuteInfo);

    }
  }
  // 获取和设置初始的周期数据
  async setPeriodicData() {
    let type = '每天'
    const dataListDay: TaskExecuteInfo[] = await executeInfoTable.queryWhereExecuteInfo({ 'projectName': this.projectInfo.name, 'periodic': type })
    dataListDay.forEach((data: TaskExecuteInfo) => {
      this.taskListEvery.push({
        数据: data,
        类型: type
      })
    })

    type = '每周'
    const dataListWeek: TaskExecuteInfo[] = await executeInfoTable.queryWhereExecuteInfo({ 'projectName': this.projectInfo.name, 'periodic': type })
    dataListWeek.forEach((data: TaskExecuteInfo) => {
      this.taskListWeek.push({
        数据: data,
        类型: type
      })
    })

    type = '每月'
    const dataLisMonth: TaskExecuteInfo[] = await executeInfoTable.queryWhereExecuteInfo({ 'projectName': this.projectInfo.name, 'periodic': type })
    dataLisMonth.forEach((data: TaskExecuteInfo) => {
      this.taskListMonth.push({
        数据: data,
        类型: type
      })
    })

    await this.existTodayTaskExecuteResult()
  }

  // 如果存在今天任务的执行结果
  async existTodayTaskExecuteResult() {
    // 找到最后一条
    const lastData: TaskExecuteResultInfo = await taskExecuteResultInfoTable.queryProjectTaskExecuteResultLastInfo(this.projectInfo.name);
    const d1 = lastData?.createTime;
    // 把设置到该日零点
    const d10 = d1?.setHours(0, 0, 0, 0);
    const d20 = new Date().setHours(0, 0, 0, 0);
    const d24 = new Date().setHours(24, 0, 0, 0);

    // 如果说最后一条数据是今日的数据，必须让今日的数据从数据库中取出
    if (lastData !== undefined && d10 === d20) {
      // 返回某项目的今日项目
      this.taskListToday = await taskExecuteResultInfoTable.queryAllProjectTaskExecuteResultInfos(
        [this.projectInfo.name, new Date(d20)],
        [this.projectInfo.name, new Date(d24)]
      );
      return;
    } else {
      this.calculateTodayTaskList();
    }
  }

  // 添加任务执行结果到数据库
  async addTaskExecuteResult(data: TaskExecuteInfo, position: number = -1) {
    // 当前项目中的数量
    const count = await taskExecuteResultInfoTable.queryProjectTaskResultCount(this.projectInfo.name);

    const newData: TaskExecuteResultInfo = {
      executeInfo: data,
      projectName: data.projectName,
      status: '未执行',
      sort: count + 1
    }
    // 添加数据到数据库
    newData['id'] = await taskExecuteResultInfoTable.addtTaskExecuteResultInfo(newData);
    // 添加数据到指定位置
    if (position == -1) {
      this.taskListToday.splice(this.taskListToday.length, 0, newData)
    }
    else {
      this.taskListToday.splice(position, 0, newData);
    }
    // 这里之后可能需要排序
  }

  // 计算今日任务列表 
  calculateTodayTaskList() {
    // 先清除所有数据
    this.taskListToday = [];
    // 每日要做的直接加入到今日要做到中
    this.taskListEvery.forEach((data: MyDragDropType) => {
      void this.addTaskExecuteResult(data['数据']);
    })

    // 每周几
    const weekDay = getDay(new Date())
    const weekObservable = from(this.taskListWeek).pipe(
      filter((data: MyDragDropType) => {
        return weekDay === data['数据']['executionDay'];
      })
    );
    weekObservable.subscribe((data: MyDragDropType) => {
      void this.addTaskExecuteResult(data['数据']);
    })

    // 每月几号
    const monthDate = getDate(new Date())
    const monthObservable = from(this.taskListMonth).pipe(
      filter((data: MyDragDropType) => {
        return monthDate === data['数据']['executionDay'];
      })
    );
    monthObservable.subscribe((data: MyDragDropType) => {
      void this.addTaskExecuteResult(data['数据']);
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
    }
  }

  // 放下删除
  onDropDelete(e: DropEvent) {
    const dragData = e.dragData
    // 如果是周期里面来的移除
    if (dragData['类型'] !== undefined) {
      this.listClassify(dragData['类型'] as string)?.splice(dragData['原索引'] as number, 1)
      void this.removeTaskInfo(dragData['数据'] as TaskExecuteInfo)
    } else {
      // 如果是今日任务里面的数据
      const taskExecuteData = dragData as TaskExecuteResultInfo;
      this.removeTodayItem(taskExecuteData)
    }
  }
  // 移除今日执行的指定数据
  removeTodayItem(data: TaskExecuteResultInfo) {
    // 根据信息的id找到数据的位置
    const index = findIndex(
      this.taskListToday,
      (o: TaskExecuteResultInfo) => {
        return o.id === data['id'];
      })
    if (index != -1) {
      this.taskListToday.splice(index, 1)
      void taskExecuteResultInfoTable.deleteTaskExecuteResultInfo(data['id'] as number)
    }
  }
  // 移除由周期删除的任务执行结果信息的数据和相应周期数据
  async removeTaskInfo(data: TaskExecuteInfo) {
    await executeInfoTable.deleteExecuteInfo(data['id'] as number);
    // 根据信息的id找到数据的位置
    const index = findIndex(
      this.taskListToday,
      (o: TaskExecuteResultInfo) => {
        return o['executeInfo']['id'] === data['id'];
      })
    if (index != -1) {
      await taskExecuteResultInfoTable.deleteTaskExecuteResultInfo(this.taskListToday[index]['id'] as number)
      this.taskListToday.splice(index, 1)
    }
  }
  // 今日执行添加指定的数据
  addTodayItem(data: TaskExecuteInfo) {
    if (data['periodic'] === '每天') {
      void this.addTaskExecuteResult(data);
    }
    else if (data['periodic'] === '每周') {
      // 每周几
      const weekDay = getDay(new Date())
      if (weekDay === data['executionDay']) {
        void this.addTaskExecuteResult(data);
      }
    } else if (data['periodic'] === '每月') {

      // 每月几号
      const monthDate = getDate(new Date())
      if (monthDate === data['executionDay']) {
        void this.addTaskExecuteResult(data);
      }
    }
  }

  // 原数据批量选中
  onBatchSelectRaw(item: MyDragDropType) {
    item['选中'] = !(item['选中'] || false);
    // this.cdr.detectChanges();
  }

  onDropToday(e: DropEvent) {
    // 等于意味着，这个来自于外部，周期里的数据
    if (e.dragFromIndex === -1) {
      const newIndex = e.dropIndex;
      void this.addTaskExecuteResult(e.dragData['数据'] as TaskExecuteInfo, newIndex)
    } else {
      // 这里意味着用户可能需要排序
      const oldIndex = e.dragFromIndex as number;
      let newIndex = e.dropIndex as number;
      if (oldIndex !== -1 && newIndex > oldIndex) {
        newIndex--;
      }
      this.taskListToday.splice(newIndex, 0, oldIndex === -1 ? e.dragData['数据'] as TaskExecuteResultInfo : this.taskListToday.splice(oldIndex, 1)[0]);
      // 排序
      void this.todayListSortChange()
    }
  }

  // 今日任务列表的排序
  async todayListSortChange() {
    for (let i = 0; i < this.taskListToday.length; ++i) {
      await taskExecuteResultInfoTable.updateTaskExecuteResultInfo(
        this.taskListToday[i]['id'] as number,
        { sort: i }
      )
    }
  }

  // 原数据批量选中检查
  onBatchSelectRawCheck(event: MouseEvent, item: MyDragDropType) {
    // 如果按了ctrl键就执行
    if (event.ctrlKey) {
      this.onBatchSelectRaw(item);
    }
  }

  // 修改执行日数据
  async onChangeExecutionDay(e: number, taskData: TaskExecuteInfo) {
    await executeInfoTable.updateExecuteInfo(taskData['id'] as number, { 'executionDay': e });
    this.addTodayItem(taskData)
  }

}
