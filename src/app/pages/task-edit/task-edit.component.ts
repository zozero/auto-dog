import { Component, OnInit } from '@angular/core';
import { ProjectInfo } from '../../core/interface/config-type';
import { TableHttpService } from '../../core/services/https/table-http.service';
import { ProjectMenuService } from '../../core/services/menus/project-menu.service';
import { DevUIModule, DialogService, LayoutModule, LoadingModule, LoadingService, TabsModule, ToastService } from 'ng-devui';
import { TipsDialogService } from '../../core/services/tips-dialog/tips-dialog.service';
import { CommonModule } from '@angular/common';
import { ProjectMenusComponent } from '../../shared/components/project-menus/project-menus.component';
import { TaskTableComponent } from "./task-table/task-table.component";
import { CreateTaskFileDialogComponent } from './create-task-file-dialog.component';

@Component({
    selector: 'app-task-edit',
    standalone: true,
    templateUrl: './task-edit.component.html',
    styleUrl: './task-edit.component.scss',
    imports: [
        LayoutModule,
        CommonModule,
        ProjectMenusComponent,
        DevUIModule,
        LoadingModule,
        TabsModule,
        TaskTableComponent
    ]
})
export class TaskEditComponent implements OnInit {

  currentProject!: ProjectInfo;
  // 表格文件名列表
  taskFileList: string[] = []
  // 激活的菜单栏
  tabActiveId!: string | number;

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
        this.setTaskFileList()
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
  // 添加或者删除文件
  addOrDelTaskTable($event: { id: string | number, operation: string }) {
    if ($event.operation === 'add') {
      this.openCreateTaskDialog()
    } else {
      this.deleteTaskFile($event.id)
    }
  }

  // 开一个创建任务的对话框
  openCreateTaskDialog() {
    const results = this.dialogService.open({
      id: 'createTaskDialog',
      width: '346px',
      maxHeight: '600px',
      title: '创建任务文件',
      content: CreateTaskFileDialogComponent,
      backdropCloseable: true,
      data: {
        projectInfo: this.currentProject,
        close: () => {
          this.setTaskFileList()
          results.modalInstance.hide();
        },
      },
      buttons: [
      ],
    });
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

  // 删除弹框提示
  deleteTaskFile(fileName: string | number) {
    const config = {
      id: 'delete-task-dialog',
      width: '346px',
      maxHeight: '600px',
      zIndex: 1050,
      backdropCloseable: true,
      html: true,
    };

    const results = this.dialogService.open({
      ...config,
      dialogtype: 'warning',
      content: "确定要删除吗?右上角关闭等于取消。",
      buttons: [
        {
          cssClass: 'primary',
          text: '确定',
          handler: () => {
            // 先关闭弹窗，防止后续的提示显示不到位。
            results.modalInstance.hide();

            this.tableHttp.deleteTaskCsvFile(
              this.currentProject.executionSideInfo?.ipPort as string,
              this.currentProject.name,
              fileName as string
            ).subscribe({
              next: (data: any) => {
                this.setTaskFileList();
                this.toastService.open({
                  value: [{ severity: 'success', summary: '摘要', content: data }],
                });
              },
              error: (err: any) => {
                this.tipsDialog.responseErrorState(err.status as number)
              },
              complete: () => {

              }
            })
          },
        },
      ],
    });
  }
}
