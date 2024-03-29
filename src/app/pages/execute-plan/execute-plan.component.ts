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
import { Store, select } from '@ngrx/store';
import { TaskActions } from '../../store/task/task.actions';
import { selectTaskAll, selectTaskList } from '../../store/task/task.selectors';
import { filter, sortBy } from 'lodash-es';
import { ProjectActions } from '../../store/project/project.actions';
import { ExecutionHttpService } from '../../core/services/https/execution-http.service';
import { TestTaskDataType } from '../../core/interface/table-type';
import { taskExecuteResultInfoTable } from '../../core/services/dexie-db/task-execute-result-table.service';
import { selectProjectById } from '../../store/project/project.selectors';
import { ProjectStateType } from '../../core/interface/execute-type';



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
    private tipsService: TipsDialogService,
    private toastService: ToastService,
    private executionHttpService: ExecutionHttpService
  ) { }

  ngOnInit(): void {
    console.log("ExecutePlanComponent");
    this.projecMenuInit();

    const beforeList = this.store.pipe(select(selectTaskList))
    beforeList.subscribe((data: any) => {
      console.log("beforeListbeforeList")
      console.log("data", data)
    }
    )
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
    exeDatas.subscribe((exeData) => {
      // 先找到当前的项目的数据
      exeData = filter(exeData, o => o['projectName'] === this.currentProject.name)
      // 再去排序
      exeData = sortBy(exeData, o => o['sort'])

      let projectStateBool = false
      const selectIdObser = this.store.pipe(select(selectProjectById(this.currentProject.id as number)))
      selectIdObser.subscribe((projectStateData) => {
        
        projectStateBool = projectStateData?.executing as boolean;

      })

      if (exeData[0] !== undefined && exeData[0]['status'] === '未执行' && !projectStateBool) {
        // 修改数据库中任务的执行状态
        void taskExecuteResultInfoTable.updateTaskExecuteResultInfo(exeData[0]['id'] as number, {
          status: '执行中'
        })

        // 开始前，修改项目执行状态
        const UpdateNum = {
          id: this.currentProject.id as number,
          changes: { executing: true }
        }
        // 状态管理添加新的任务
        this.store.dispatch(ProjectActions['单改任务']({
          update: UpdateNum
        }))


        const testData: TestTaskDataType = {
          模拟器的ip和端口: this.currentProject.simulatorInfo?.ipPort as string,
          项目名: this.currentProject.name,
          任务名: exeData[0]['executeInfo']['name']
        }
        // 发送请求
        this.executionHttpService.postTestTaskData(
          this.currentProject.executionSideInfo?.ipPort as string,
          testData
        ).subscribe({
          next: (httpData: any) => {
            // 修改数据库中任务的执行状态
            void taskExecuteResultInfoTable.updateTaskExecuteResultInfo(exeData[0]['id'] as number, {
              status: '已执行'
            })

            this.toastService.open({
              value: [{ severity: 'success', summary: '摘要', content: httpData }],
            })
          },
          error: (err: any) => {
            // 修改数据库中任务的执行状态
            void taskExecuteResultInfoTable.updateTaskExecuteResultInfo(exeData[0]['id'] as number, {
              status: '未预期'
            })

            this.tipsService.responseErrorState(err.status as number)

          },
          complete: () => {
            console.log("complete")
            // 删除任务
            this.changeProjectState(this.currentProject.id as number, false)
            this.store.dispatch(TaskActions['删除任务']({ id: exeData[0]['id'] as number }))
          }
        }
        )
      }
    })
  }

  // 修改项目的状态id
  changeProjectState(id: number, state: boolean) {
    // 完成后，修改项目执行状态
    const UpdateNum = {
      id: id,
      changes: { executing: state }
    }
    // 状态管理添加新的任务
    this.store.dispatch(ProjectActions['单改任务']({
      update: UpdateNum
    }))
  }

  onClickProject() {
    const UpdateNum = {
      id: 1,
      changes: { executing: true }
    }
    // 状态管理添加新的任务
    this.store.dispatch(ProjectActions['单改任务']({
      update: UpdateNum
    }))

  }
}