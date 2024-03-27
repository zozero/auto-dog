
import { Component, OnInit } from '@angular/core';
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

  // items!:any
  // groups!:any
  // // 先写一笔假数据
  // tmpTaskList: string[] = ["下载", "购买", "签到"]
  // tmpStart!:number;
  // tmpEnd!:number;
  // viewType =GanttViewType.day

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
  // 初始化甘特图数据
  // initGanttDatas() {
  //   const groups: GanttGroup[] = [];
  //   const items: GanttItem[] = [];
  //   groups.push({
  //     id: '1',
  //     title: this.currentProject.name
  //   })
  //   let tmpDate=new Date()
  //   // let a1:GanttBaselineItem
  //   console.log("12313",tmpDate)
  //   for (let i = 0; i < this.tmpTaskList.length; ++i) {
  //     const start = addHours(new Date(), random(-1, 1));
  //     const end = addHours(start, random(0, 1));

  //     items.push({
  //       id: String(i),
  //       title: this.tmpTaskList[i],
  //       start: getUnixTime(start),
  //       end: getUnixTime(end),
  //       group_id: '1',
  //       draggable: true,
  //       itemDraggable: true
  //     })
  //   }

  //   this.groups = groups
  //   this.items = items
  // }

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