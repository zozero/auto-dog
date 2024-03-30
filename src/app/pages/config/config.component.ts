
import { Component, OnInit, ViewChild } from '@angular/core';
import { ExecutionSideTableComponent } from './execution-side-table/execution-side-table.component';
import { ExecutionSideInfo, ProjectInfo, SimulatorInfo } from '../../core/interface/config-type';
import { SimulatorTableComponent } from "./simulator-table/simulator-table.component";
import { AlertModule } from 'ng-devui/alert';
import { ProjectTableComponent } from "./project-table/project-table.component";
import { DialogService, LayoutModule } from 'ng-devui';
import { configTable } from '../../core/services/dexie-db/config-table.service';
import { executionSideTable } from '../../core/services/dexie-db/execution-side-table.service';
import { simulatorTable } from '../../core/services/dexie-db/simulator-table.service';
import { projectTable } from '../../core/services/dexie-db/project-table.service';
import { ButtonModule } from 'ng-devui/button';
import { dexieDB } from '../../core/services/dexie-db/dexie-db.service';
import { MyLocalStorageService } from '../../core/services/my-local-storage/my-local-storage.service';


@Component({
  selector: 'app-config',
  standalone: true,
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
  imports: [
    LayoutModule,
    ExecutionSideTableComponent,
    SimulatorTableComponent,
    AlertModule,
    ProjectTableComponent,
    ButtonModule
  ]
})
export class ConfigComponent implements OnInit {
  version: string = '';
  executionSideInfoList: ExecutionSideInfo[] = []
  simulatorInfoList: SimulatorInfo[] = []
  projectInfoList: ProjectInfo[] = []

  // 获取任务拖拽组件
  @ViewChild('projectTable') public projectTableComponent!: ProjectTableComponent;
  constructor(
    private dialogService: DialogService,
    private myLocalStorage: MyLocalStorageService

  ) {

  }
  ngOnInit(): void {
    void this.initData();

  }
  // 初始化数据
  async initData() {
    await configTable.initConfigData();

    await executionSideTable.initExecutionSideInfo();
    await simulatorTable.initSimulatorInfo();
    await projectTable.initProjectInfo();

    await this.setVersion();
    await this.getAndSetData();
  }
  // 获取执行侧数据和模拟器数据
  async getAndSetData() {
    // 获取和设置数据
    this.executionSideInfoList = await executionSideTable.queryAllExecutionSideInfos();
    this.simulatorInfoList = await simulatorTable.queryAllSimulatorInfos();
    this.projectInfoList = await projectTable.queryAllProjectInfos();
  }


  // 设置程序版本信息
  async setVersion() {
    const configData = await configTable.configDataTable
      .where({ id: 1 })
      .toArray();
    if (configData.length) {
      this.version = configData[0].version;
    }
  }

  // 接收来信息更新的消息
  async recvUpdateInfo() {
    await this.projectTableComponent.resetData();
  }

  // 重置数据库
  resetDatabase() {
    const config = {
      id: 'reset-database-dialog',
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
      content: "不会真的有人点它吧！不是吧！不是吧。它会清空整个数据啊！！！但它不会影响执行端的数据。删库跑路，居家必备，重置后你必须刷新或重启应用。",
      buttons: [
        {
          cssClass: 'danger',
          text: '确定',
          handler: () => {
            void dexieDB.initTable();
            this.myLocalStorage.clear();
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
