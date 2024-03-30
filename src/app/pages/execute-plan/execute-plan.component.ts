import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ProjectInfo } from '../../core/interface/config-type';
import { TableHttpService } from '../../core/services/https/table-http.service';
import { ProjectMenuService } from '../../core/services/menus/project-menu.service';
import { DevUIModule, DialogService, LoadingModule, LoadingService, TabsModule, ToastService } from 'ng-devui';
import { TipsDialogService } from '../../core/services/tips-dialog/tips-dialog.service';
import { CommonModule } from '@angular/common';
import { ProjectMenusComponent } from '../../shared/components/project-menus/project-menus.component';
import { DragPeriodicComponent } from "./drag-periodic/drag-periodic.component";
import { Store, select } from '@ngrx/store';
import { TaskActions } from '../../store/task/task.actions';
import { selectTaskAll } from '../../store/task/task.selectors';
import { cloneDeep, filter, sortBy } from 'lodash-es';
import { ProjectActions } from '../../store/project/project.actions';
import { ExecutionHttpService } from '../../core/services/https/execution-http.service';
import { TestTaskDataType } from '../../core/interface/table-type';
import { taskExecuteResultInfoTable } from '../../core/services/dexie-db/task-execute-result-table.service';
import { selectProjectById } from '../../store/project/project.selectors';
import { TaskExecuteResultInfo } from '../../core/interface/execute-type';
import { ExecuteResultTableComponent } from "./execute-result-table/execute-result-table.component";
import { Subscription, timer } from 'rxjs';



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
    ExecuteResultTableComponent
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
  // 执行按钮的状态
  executing: boolean = false;
  // 暂停按钮载入
  pauseLoading: boolean = false;
  // 获取任务拖拽组件
  @ViewChild('dragPeriodic') public dragPeriodic!: DragPeriodicComponent;
  // 获取任务表格组件
  @ViewChild('executeResultTable') public executeResultTable!: ExecuteResultTableComponent;

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

    this.setExecuteButton();
  }

  // 设置执行按钮的状态
  setExecuteButton() {
    const selectIdObser = this.store.pipe(select(selectProjectById(this.currentProject.id as number)))
    selectIdObser.subscribe((projectStateData) => {
      this.executing = projectStateData?.executing as boolean;
    })
  }


  // 执行按钮点击
  onClickExecute() {
    this.getProjectTaskResult();
  }

  getProjectTaskResult() {
    console.log("开始执行吧")
    // 告诉状态管理，该项目有任务正在进行
    // this.changeProjectState(this.currentProject.id as number, true)
    // 克隆数据这样即使this.currentProject改变了也不会影响到内部的项目运行。
    const tmpProjectInfo = cloneDeep(this.currentProject)
    // 获取所有数据
    const exeDatas = this.store.pipe(select(selectTaskAll))
    let tmpSubscribe: Subscription = new Subscription()

    tmpSubscribe = exeDatas.subscribe((exeData) => {
      //  exeDatas.subscribe((exeData) => {
      if (tmpSubscribe === null || tmpSubscribe === undefined) {
        return;
      }

      // 先找到当前的项目的数据
      exeData = filter(exeData, o => o['projectName'] === tmpProjectInfo.name)
      // 再去排序
      exeData = sortBy(exeData, o => o['sort'])

      if (exeData === undefined || exeData.length===0) {
        tmpSubscribe.unsubscribe()
        return;
      }

      let projectStateBool = false
      const selectIdObser = this.store.pipe(select(selectProjectById(tmpProjectInfo.id as number)))
      const tmpSelectIdSubscribe = selectIdObser.subscribe((projectStateData) => {
        projectStateBool = projectStateData?.executing as boolean;
      })
      // 执行完后直接停止订阅
      tmpSelectIdSubscribe.unsubscribe()

      const firstExeData: TaskExecuteResultInfo = cloneDeep(exeData[0]);

      // 先获取暂停状态，提前判断一波
      let pauseState = false
      const pauseObser = this.store.pipe(select(selectProjectById(firstExeData['projectId'])))
      const pauseSubscribe = pauseObser.subscribe((projectStateData: any) => {
        pauseState = projectStateData?.pause as boolean;
      })
      // 使用完后停止订阅
      pauseSubscribe.unsubscribe();

      if (firstExeData !== undefined && firstExeData['status'] === '未执行' && !projectStateBool && !pauseState) {
        // 告诉状态管理，该项目有任务正在进行
        this.changeProjectState(firstExeData['projectId'], true)
        // 修改数据库中任务的执行状态
        void taskExecuteResultInfoTable.updateTaskExecuteResultInfo(firstExeData['id'] as number, {
          status: '执行中',
          start: new Date()
        })
        // 开始前，修改项目执行状态
        const UpdateNum = {
          id: firstExeData.projectId,
          changes: { executing: true }
        }
        // 状态管理添加新的任务
        this.store.dispatch(ProjectActions['单改任务']({
          update: UpdateNum
        }))

        // 请求测试任务用的数据
        const testData: TestTaskDataType = {
          模拟器的ip和端口: firstExeData.simulatorInfoIpPort,
          项目名: firstExeData.projectName,
          任务名: firstExeData['executeInfo']['name']
        }
        // 发送请求
        this.executionHttpService.postTestTaskData(
          firstExeData['executeSideIpPort'],
          testData
        ).subscribe({
          next: (httpData: any) => {
            // 修改数据库中任务的执行状态
            void taskExecuteResultInfoTable.updateTaskExecuteResultInfo(firstExeData['id'] as number, {
              status: '已执行',
              end: new Date()
            })

            this.toastService.open({
              value: [{ severity: 'success', summary: '摘要', content: httpData }],
            })
          },
          error: (err: any) => {
            // 修改数据库中任务的执行状态
            void taskExecuteResultInfoTable.updateTaskExecuteResultInfo(firstExeData['id'] as number, {
              status: '未预期'
            })

            this.tipsService.responseErrorState(err.status as number)

          },
          complete: () => {
            console.log("complete")
            console.log("exeData",exeData)
            if (firstExeData !== undefined) {
              // 删除任务
              this.store.dispatch(TaskActions['删除任务']({ id: firstExeData['id'] as number }))
              this.dragPeriodic.changeTodayTaskListByExecutePlan(firstExeData)
               // 更改项目状态
               this.changeProjectState(firstExeData['projectId'], false)
            }
          }
        }
        )
      }

      // 如果已经没有数据就停止订阅，
      if (exeData?.length <= 1 || pauseState) {
        // 重置暂停
        this.onResetPause(firstExeData['projectId']);
        // 重置暂停
        if (tmpSubscribe !== undefined && tmpSubscribe !== null) {
          tmpSubscribe.unsubscribe();
        }
      }
    })

  }

  // 修改项目的状态id
  changeProjectState(id: number, state: boolean) {
    this.executing = state
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

  // 暂停按钮
  onClickPause() {
    // 正在载入
    this.pauseLoading = true

    // 开始前，修改项目执行状态，无法暂停正在进行中的任务
    const UpdateNum = {
      id: this.currentProject.id as number,
      changes: { pause: true }
    }
    // 状态管理添加新的任务
    this.store.dispatch(ProjectActions['单改任务']({
      update: UpdateNum
    }))

    // 防止多次误触，或每反应过来
    timer(1000).subscribe(() => {
      this.pauseLoading = false
    })
  }

  // 重置暂停按钮
  onResetPause(id: number) {
    // 开始前，修改项目执行状态，无法暂停正在进行中的任务
    const UpdateNum = {
      id: id,
      changes: { pause: false }
    }
    // 状态管理添加新的任务
    this.store.dispatch(ProjectActions['单改任务']({
      update: UpdateNum
    }))
  }

  // 清空任务
  onClearTask() {
    const config = {
      id: 'execute-dialog',
      width: '346px',
      maxHeight: '600px',
      zIndex: 1050,
      backdropCloseable: true,
      html: true,
    };
    const results = this.dialogService.open({
      ...config,
      dialogtype: 'failed',
      title: '警告!!!',
      content: "它会清空所有项目的所有任务数据！！！",
      buttons: [
        {
          cssClass: 'danger',
          text: '确定',
          handler: () => {
            void this.dragPeriodic.clearAllTaskListByExecutePlan()
            results.modalInstance.hide();
          },
        },
        {
          id: 'btn-cancel',
          cssClass: 'primary',
          text: '取消',
          handler: () => {
            results.modalInstance.hide();
          },
        },
      ],
    });


  }

  // 清空任务结果信息
  onClearTaskResult() {
    const config = {
      id: 'execute-result-dialog',
      width: '346px',
      maxHeight: '600px',
      zIndex: 1050,
      backdropCloseable: true,
      html: true,
    };
    const results = this.dialogService.open({
      ...config,
      dialogtype: 'failed',
      title: '警告!!!',
      content: "它会清空所有项目的所有任务结果数据！！！",
      buttons: [
        {
          cssClass: 'danger',
          text: '确定',
          handler: () => {
            void this.executeResultTable.clearAllTaskResultListByExecutePlan()
            results.modalInstance.hide();
          },
        },
        {
          id: 'btn-cancel',
          cssClass: 'primary',
          text: '取消',
          handler: () => {
            results.modalInstance.hide();
          },
        },
      ],
    });
  }
}
