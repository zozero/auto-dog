import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { DragDropModule, DropEvent } from 'ng-devui/dragdrop';
import { LayoutModule } from 'ng-devui';
import { cloneDeep, findIndex } from 'lodash';
import { ButtonModule } from 'ng-devui/button';
import { IconModule } from 'ng-devui/icon';
import { BadgeModule } from 'ng-devui/badge';
import { MyDragDropType } from '../../../core/interface/execute-type';

@Component({
  selector: 'app-drag-periodic',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    LayoutModule,
    ButtonModule,
    IconModule,
    BadgeModule,
  ],
  templateUrl: './drag-periodic.component.html',
  styleUrl: './drag-periodic.component.scss'
})
export class DragPeriodicComponent {
  // 任务列表 "下载", "购买", "签到", "快速行动"
  taskList: MyDragDropType[] = [
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
      数据: "快速行动",
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
  taskListToday: MyDragDropType[] = [
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
      数据: "快速行动",
      选中: false
    }
  ];

  constructor(private cdr: ChangeDetectorRef) { }

  // 放下
  onDrop(e: DropEvent, list: MyDragDropType[]) {
    console.log("🚀 ~ DragPeriodicComponent ~ onDrop ~ e:", e)
    if (e.batchDragData && e.batchDragData.length > 1) {
      this.onDropBatch(e, list);
    } else {
      list.push(e.dragData as MyDragDropType);
    }

  }
  // 放下批量数据
  onDropBatch(e: DropEvent, list: MyDragDropType[]) {
    e.batchDragData.forEach((element: MyDragDropType) => {
      list.push(element);
    });
  }

  // 拖动开始事件
  onDragStart(i: number, obj: MyDragDropType[]) {
    obj[i]['原索引'] = i;
    obj[i]['对象'] = obj;
  }

  // 放下 删除
  onDropDelete(e: DropEvent) {
    e.dragData['对象'].splice(e.dragData['原索引'] as number, 1);
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
      if ( oldIndex !== -1 && newIndex > oldIndex) {
        newIndex--;
      }
      list.splice(newIndex, 0, oldIndex === -1 ? e.dragData as MyDragDropType : list.splice(oldIndex, 1)[0]);
    } else {
      this.onDrop(e, list);
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
}
