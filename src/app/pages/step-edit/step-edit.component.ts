import { Component, OnInit } from '@angular/core';
import { ProjectMenuService } from '../../core/services/menus/project-menu.service';
import { DevUIModule, DialogService, LayoutModule, LoadingService, ToastService } from 'ng-devui';
import { CommonModule } from '@angular/common';
import { ProjectMenusComponent } from '../../shared/components/project-menus/project-menus.component';
import { LoadingModule } from 'ng-devui/loading';
import { TabsModule } from 'ng-devui/tabs';
import { ProjectInfo } from '../../core/interface/config-type';
import { StepTableComponent } from "./step-table/step-table.component";
import { CreateStepFileDialogComponent } from './create-step-file-dialog.component';
import { TableHttpService } from '../../core/services/https/table-http.service';
import { TipsDialogService } from '../../core/services/tips-dialog/tips-dialog.service';

@Component({
  selector: 'app-step-edit',
  standalone: true,
  templateUrl: './step-edit.component.html',
  styleUrl: './step-edit.component.scss',
  imports: [
    LayoutModule,
    CommonModule,
    ProjectMenusComponent,
    DevUIModule,
    LoadingModule,
    TabsModule,
    StepTableComponent
  ]
})
export class StepEditComponent implements OnInit {
  currentProject!: ProjectInfo;
  // 表格文件名列表
  stepFileList: string[] = []
  // 激活的菜单栏
  tabActiveId!: string | number;
  constructor(
    private tableHttp: TableHttpService,
    private menu: ProjectMenuService,
    private loadingService: LoadingService,
    private dialogService: DialogService,
    private tipsService: TipsDialogService,
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
        this.setStepFileList()
      })
      .then(() => {
        // 关闭载入提示
        loadTip.loadingInstance.close();

      });
  }
  // 从子菜单组件中发送信息到这里，用于修改当前子菜单的信息。
  getCurrentProject(currentProject: ProjectInfo) {
    this.stepFileList = []
    this.tabActiveId = ''
    this.currentProject = currentProject;
    this.setStepFileList()

  }
  // 当前激活的栏
  activeTabChange(tab: any) {
    // console.log(tab);
  }
  // 添加或者删除文件
  addOrDelStepTable($event: { id: string | number, operation: string }) {
    if ($event.operation === 'add') {
      this.openCreateStepDialog()
    } else {
      this.deleteStepFile($event.id)
    }
  }

  // 开一个创建步骤的对话框
  openCreateStepDialog() {
    const results = this.dialogService.open({
      id: 'createStepDialog',
      width: '346px',
      maxHeight: '600px',
      title: '创建步骤文件',
      content: CreateStepFileDialogComponent,
      backdropCloseable: true,
      data: {
        projectInfo: this.currentProject,
        close: () => {
          this.setStepFileList()
          results.modalInstance.hide();
        },
      },
      buttons: [
      ],
    });
  }

  // 设置步骤csv文件列表栏
  setStepFileList() {
    // 数据载入提示
    const loadTip = this.loadingService.open();
    this.tableHttp.getStepCsvFileList(
      this.currentProject.executionSideInfo?.ipPort as string,
      this.currentProject.name
    ).subscribe({
      next: (data: any) => {
        // eslint-disable-next-line prefer-const
        let newArr: string[] = []
        data.forEach((el: string) => {
          newArr.push(el.split('.')[0])
        });
        this.stepFileList = newArr
        if (!this.tabActiveId) {
          this.tabActiveId = this.stepFileList[0]
        }
      },
      error: (err: any) => {
        this.tipsService.responseErrorState(err.status as number)
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
  deleteStepFile(fileName: string | number) {
    const config = {
      id: 'delete-step-dialog',
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

            this.tableHttp.deleteStepCsvFile(
              this.currentProject.executionSideInfo?.ipPort as string,
              this.currentProject.name,
              fileName as string
            ).subscribe({
              next: (data: any) => {
                this.setStepFileList();
                this.toastService.open({
                  value: [{ severity: 'success', summary: '摘要', content: data }],
                });
              },
              error: (err: any) => {
                this.tipsService.responseErrorState(err.status as number)
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
