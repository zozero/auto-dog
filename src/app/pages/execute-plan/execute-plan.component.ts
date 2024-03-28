import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectInfo } from '../../core/interface/config-type';
import { TableHttpService } from '../../core/services/https/table-http.service';
import { ProjectMenuService } from '../../core/services/menus/project-menu.service';
import { DevUIModule, DialogService, LoadingModule, LoadingService, TabsModule, ToastService } from 'ng-devui';
import { TipsDialogService } from '../../core/services/tips-dialog/tips-dialog.service';
import { CommonModule } from '@angular/common';
import { ProjectMenusComponent } from '../../shared/components/project-menus/project-menus.component';
import { DragPeriodicComponent } from "./drag-periodic/drag-periodic.component";
import { ExecuteEditComponent } from "./execute-edit/execute-edit.component";



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
  onClickExecute(){
    console.log(this.dragPeriodic.taskListToday)
  }
}