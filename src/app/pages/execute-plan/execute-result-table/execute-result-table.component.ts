import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { ProjectInfo } from '../../../core/interface/config-type';
import { DataTableModule, DevUIModule, FilterConfig, LoadingService, LoadingType } from 'ng-devui';
import { TableHttpService } from '../../../core/services/https/table-http.service';
import { TipsDialogService } from '../../../core/services/tips-dialog/tips-dialog.service';
import { TaskExecuteResultInfo } from '../../../core/interface/execute-type';
import { taskExecuteResultInfoTable } from '../../../core/services/dexie-db/task-execute-result-table.service';
import { CommonModule } from '@angular/common';
import { filter, uniq } from 'lodash-es';
import { DCommonModule } from 'ng-devui/common';
import { Store, select } from '@ngrx/store';
import { selectTaskList } from '../../../store/task/task.selectors';

@Component({
  selector: 'app-execute-result-table',
  standalone: true,
  imports: [
    DataTableModule,
    DevUIModule,
    CommonModule,
    DCommonModule
  ],
  templateUrl: './execute-result-table.component.html',
  styleUrl: './execute-result-table.component.scss'
})
export class ExecuteResultTableComponent implements OnInit, OnChanges {
  @Input() projectInfo!: ProjectInfo;
  taskTableHeader: string[] = [
    '任务名',
    '状态',
    '开始时间',
    '结束时间',
    '创建时间'
  ]
  taskResultList: TaskExecuteResultInfo[] = []
  // 专用于过滤的csv列表
  taskResultFilterList: TaskExecuteResultInfo[] = [];
  // 数据的载入提示
  loadingTip!: LoadingType;
  // 序号筛选列表
  stateFilterList: FilterConfig[] = []
  // 任务名称刷选列表
  taskNameFilterList: FilterConfig[] = []
  // ngrx的依赖注入
  private store = inject(Store)
  constructor(
    private loadingService: LoadingService,
    private tableHttp: TableHttpService,
    private tipsDialog: TipsDialogService,
  ) { }
  ngOnInit(): void {
    // // console.log("ExecuteEditComponent")
    this.store.pipe(select(selectTaskList)).subscribe(() => {
      void this.getExecuteResultInfoList();
    })

  }
  // 自动监听到改变事件后执行
  ngOnChanges(changes: SimpleChanges) {
    if ('projectInfo' in changes) {
      void this.getExecuteResultInfoList();
    }
  }

  // 获得执行结果的信息列表
  async getExecuteResultInfoList() {
    this.taskResultList = []
    this.taskResultFilterList = [];
    this.stateFilterList = []
    this.taskNameFilterList = []

    // 从数据库中取出项目数据
    this.taskResultList = await taskExecuteResultInfoTable.queryProjectTaskResultInfos(this.projectInfo.name);
    this.taskResultFilterList = this.taskResultList;
    this.setTaskNameFilterList();
    this.setStateFilterList();
  }
  // 设置任务名的筛选列表
  setTaskNameFilterList() {
    // 初始化为空
    this.taskNameFilterList = []
    let tmpList: string[] = []
    // 设置数据
    this.taskResultList.forEach((data: TaskExecuteResultInfo) => {
      tmpList.push(data['executeInfo']['name'])
    })
    // 筛选重复的状态类型
    tmpList = uniq(tmpList)
    // 筛选重复的任务名称
    tmpList.forEach((data: string) => {
      this.taskNameFilterList.push({
        name: data,
        value: data
      })
    })
  }

  // 设置状态的筛选列表
  setStateFilterList() {
    this.stateFilterList = [{
      name: '未执行',
      value: '未执行'
    }, {
      name: '执行中',
      value: '执行中'
    }, {
      name: '已执行',
      value: '已执行'
    }, {
      name: '未预期',
      value: '未预期'
    }
    ]
  }

  // 排序方式改变，暂时不做
  // onSortChange(event: SortEventArg,type:string) {
  //   if (event.direction === SortDirection.ASC) {
  //     // 转成数字才能按照数字排序
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  //     this.taskResultFilterList = orderBy(this.taskResultFilterList, [(data: any) => parseInt(data['executeInfo']['name'])], ['asc'])

  //   } else if (event.direction === SortDirection.DESC) {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  //     this.taskResultFilterList = orderBy(this.taskResultFilterList, [(data: any) => parseInt(data['executeInfo']['name'])], ['desc'])

  //   }
  //   else {
  //     this.taskResultFilterList = this.taskResultList
  //   }
  // }

  // 多选过滤改变
  filterChangeMutil($event: FilterConfig[], key: string) {
    if ($event.length === this.taskNameFilterList.length) {
      this.taskResultFilterList = this.taskResultList
    }
    else {
      // eslint-disable-next-line prefer-const
      let dataList: TaskExecuteResultInfo[] = []
      $event.forEach(data => {
        const tmpDatas: any[] = filter(this.taskResultList, (o: TaskExecuteResultInfo) => {
          if (key === '任务名') {
            return o['executeInfo']['name'].includes(data.value as string)

          } else if (key === '状态') {
            return o['status'].includes(data.value as string)
          }
          else {
            return false;
          }

        })
        tmpDatas.forEach((data2: TaskExecuteResultInfo) => {

          dataList.push(data2)
        })
      })

      this.taskResultFilterList = dataList
    }

  }
  // 清空任务结果信息表
  async clearAllTaskResultListByExecutePlan() {
    await taskExecuteResultInfoTable.clearTable();
    this.taskResultList = []
    this.taskResultFilterList = []
    this.stateFilterList = []
    this.taskNameFilterList = []
  }

}
