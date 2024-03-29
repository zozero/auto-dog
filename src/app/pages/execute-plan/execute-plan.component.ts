import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ProjectInfo } from '../../core/interface/config-type';
import { TableHttpService } from '../../core/services/https/table-http.service';
import { ProjectMenuService } from '../../core/services/menus/project-menu.service';
import { DevUIModule, DialogService, LoadingModule, LoadingService, TabsModule, ToastService } from 'ng-devui';
import { TipsDialogService } from '../../core/services/tips-dialog/tips-dialog.service';
import { CommonModule } from '@angular/common';
import { ProjectMenusComponent } from '../../shared/components/project-menus/project-menus.component';
import { DragPeriodicComponent } from "./drag-periodic/drag-periodic.component";
import { ExecuteEditComponent } from "./execute-edit/execute-edit.component";
import { taskExecuteResultInfoTable } from '../../core/services/dexie-db/task-execute-result-table.service';
import { Store, select } from '@ngrx/store';
import { TaskActions } from '../../store/task/task.actions';
import { TaskExecuteResultInfo } from '../../core/interface/execute-type';
import { selectTaskAll, selectTaskList } from '../../store/task/task.selectors';
import { filter, sortBy } from 'lodash-es';



export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}
@Component({
  selector: 'app-execute-plan',
  standalone: true,
  templateUrl: './execute-plan.component.html',
  styleUrl: './execute-plan.component.scss',
  imports: [
    CommonModule,
    ProjectMenusComponent,
    DevUIModule,
    LoadingModule,
    TabsModule,
    DragPeriodicComponent,
    ExecuteEditComponent
  ]
})
export class ExecutePlanComponent implements OnInit {
  // ngrx的依赖注入
  private store = inject(Store)
  currentProject!: ProjectInfo;
  // 表格文件名列表
  taskFileList: string[] = []
  // 激活的菜单栏
  tabActiveId!: string | number;
  // 获取任务拖拽组件
  @ViewChild('dragPeriodic') public dragPeriodic!: DragPeriodicComponent;
  // 获取任务表格组件
  @ViewChild('executeEdit') public executeEdit!: ExecuteEditComponent;

  constructor(
    private tableHttp: TableHttpService,
    private menu: ProjectMenuService,
    private loadingService: LoadingService,
    private dialogService: DialogService,
    private tipsDialog: TipsDialogService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.projecMenuInit();

    const beforeList = this.store.pipe(select(selectTaskList))
    beforeList.subscribe((data: any) => {
      console.log("beforeListbeforeList")
      console.log("data", data)
    }
    )
    console.log("ExecutePlanComponent");
  }

  // 初始化项目菜单
  projecMenuInit() {
    // 数据载入提示
    const loadTip = this.loadingService.open();
    // 初始化时设置菜单，第一次启动和每次加载
    void this.menu
      .initCurrentProject()
      .then((data) => {
        this.currentProject = data;
      })
      .then(() => {
        // 关闭载入提示
        loadTip.loadingInstance.close();

      });
  }
  // 从子菜单组件中发送信息到这里，用于修改当前子菜单的信息。
  getCurrentProject(currentProject: ProjectInfo) {
    this.taskFileList = []
    this.tabActiveId = ''
    this.currentProject = currentProject;

  }
  // 当前激活的栏
  activeTabChange(tab: any) {
    console.log(tab);
  }

  // 执行按钮点击
  onClickExecute() {
    console.log(this.dragPeriodic.taskListToday)
    void this.getProjectTaskResult();
  }

  getProjectTaskResult() {
    // 设置0点到24点，即今天的数据
    // const d0 = new Date().setHours(0, 0, 0, 0);
    // const d24 = new Date().setHours(24, 0, 0, 0);
    // const taskListToday: TaskExecuteResultInfo[] = await taskExecuteResultInfoTable.queryAllProjectTaskExecuteResultInfos(
    //   [this.currentProject.name, new Date(d0)],
    //   [this.currentProject.name, new Date(d24)]
    // );
    // // 添加数据到状态管理中
    // taskListToday.forEach((element: TaskExecuteResultInfo) => {
    //   this.store.dispatch(TaskActions['加个任务'](element))
    // });
    console.log("开始执行吧")
    // 获取所有数据
    const exeDatas = this.store.pipe(select(selectTaskAll))
    exeDatas.subscribe((data) => {
      // 先找到当前的项目的数据
      data=filter(data,o=>o['projectName']===this.currentProject.name)
      // 再去排序
      data = sortBy(data, o=>o['sort'])

      if (data[0] !== undefined) {
        // 发送请求
        
        // 删除任务
        this.store.dispatch(TaskActions['删除任务']({ id: data[0]['id'] as number }))
      }

    })
  }

  async onClickExecute2() {
    // 设置0点到24点，即今天的数据
    const d0 = new Date().setHours(0, 0, 0, 0);
    const d24 = new Date().setHours(24, 0, 0, 0);
    const taskListToday: TaskExecuteResultInfo[] = await taskExecuteResultInfoTable.queryAllProjectTaskExecuteResultInfos(
      [this.currentProject.name, new Date(d0)],
      [this.currentProject.name, new Date(d24)]
    );



  }
}