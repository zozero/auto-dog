
import { Component, OnInit } from '@angular/core';
import { ProjectInfo } from '../../core/interface/config-type';
import { TableHttpService } from '../../core/services/https/table-http.service';
import { ProjectMenuService } from '../../core/services/menus/project-menu.service';
import { DevUIModule, DialogService, LayoutModule, LoadingModule, LoadingService, TabsModule, ToastService } from 'ng-devui';
import { TipsDialogService } from '../../core/services/tips-dialog/tips-dialog.service';
import { CommonModule } from '@angular/common';
import { ProjectMenusComponent } from '../../shared/components/project-menus/project-menus.component';
import { GanttItem, NgxGanttModule } from '@worktile/gantt';


@Component({
  selector: 'app-execute-plan',
  standalone: true,
  imports: [
    LayoutModule,
    CommonModule,
    ProjectMenusComponent,
    DevUIModule,
    LoadingModule,
    NgxGanttModule,
    TabsModule
],
  templateUrl: './execute-plan.component.html',
  styleUrl: './execute-plan.component.scss'
})
export class ExecutePlanComponent implements OnInit {

  currentProject!: ProjectInfo;
  // 表格文件名列表
  taskFileList: string[] = []
  // 激活的菜单栏
  tabActiveId!: string | number;
  
  items: GanttItem[] = [
    { id: '000000', title: 'Task 0', start: 1627729997, end: 1628421197, expandable: true },
    { id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597, links: ['000003', '000004', '000000'], expandable: true },
    { id: '000002', title: 'Task 2', start: 1610536397, end: 1610622797 },
    { id: '000003', title: 'Task 3', start: 1628507597, end: 1633345997, expandable: true }
  ];
  constructor(
    private tableHttp: TableHttpService,
    private menu: ProjectMenuService,
    private loadingService: LoadingService,
    private dialogService: DialogService,
    private tipsDialog: TipsDialogService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.projecMenuInit()
    console.log("ExecutePlanComponent")
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
        // 暂时注释
        // this.setTaskFileList()
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
    this.setTaskFileList()

  }
  // 当前激活的栏
  activeTabChange(tab: any) {
    console.log(tab);
  }

  setTaskFileList() {
    // 数据载入提示
    const loadTip = this.loadingService.open();
    this.tableHttp.getTaskCsvFileList(
      this.currentProject.executionSideInfo?.ipPort as string,
      this.currentProject.name
    ).subscribe({
      next: (data: any) => {
        // eslint-disable-next-line prefer-const
        let newArr: string[] = []
        data.forEach((el: string) => {
          newArr.push(el.split('.')[0])
        });
        this.taskFileList = newArr
        if (!this.tabActiveId) {
          this.tabActiveId = this.taskFileList[0]
        }
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

}