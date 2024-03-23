import { Component, OnInit } from '@angular/core';
import { TableHttpService } from '../../core/services/https/table-http.service';
import { ProjectMenuService } from '../../core/services/menus/project-menu.service';
import { DevUIModule, LayoutModule, LoadingService } from 'ng-devui';
import { CommonModule } from '@angular/common';
import { ProjectMenusComponent } from '../../shared/components/sub-menus/project-menus.component';
import { LoadingModule } from 'ng-devui/loading';
import { ToastService } from 'ng-devui/toast';
import { TabsModule } from 'ng-devui/tabs';
import { matchMethodList } from '../../core/mock/match-mock';
import { ProjectInfo } from '../../core/interface/config-type';
import { Papa } from 'ngx-papaparse';
import { StepTableComponent } from "./step-table/step-table.component";
import { defaultStepData } from '../../core/mock/setp-mock';

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
export class StepEditComponent implements OnInit  {
  currentProject!: ProjectInfo;
  // 表格文件名列表
  stepFileList:string[] =[]

  tabActiveId: string | number =matchMethodList[0]["名称"];
  constructor(
    private tableHttp: TableHttpService,
    private menu: ProjectMenuService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private papa: Papa,
  ) {}

  ngOnInit(): void {
    
    // 数据载入提示
    const loadTip = this.loadingService.open();

    // 初始化时设置菜单，第一次启动和每次加载
    void this.menu
      .initCurrentProject()
      .then((data) => {
        this.currentProject = data;
        // this.getcsvFile();
      })
      .then(() => {
        // 关闭载入提示
        loadTip.loadingInstance.close();

      });
  }
    // 从子菜单组件中发送信息到这里，用于修改当前子菜单的信息。
    getCurrentProject(currentProject: ProjectInfo) {
      this.currentProject = currentProject;
    }
 
  activeTabChange(tab:any) {
    console.log(tab);
  }

  addOrDelStepTable($event:{id: string|number,operation: string}){
    if ($event.operation === 'add') {
      console.log($event.operation)
    }else{

      console.log($event.id)
    }
  }

  // 添加步骤表格
  createStepCsvFile(fileName:string){
    // 准备数据
    // eslint-disable-next-line prefer-const,
    let csvHeader:string[] = Object.keys(defaultStepData);
    // 这里必须要加空一行必然可能导致执行的pandas无法正常加数据
    const csvArr=[csvHeader].concat(['']);
    const csvStr = this.papa.unparse(csvArr);
    const csvBlob = new Blob([csvStr], { type: 'text/csv' });
    const csvFile = new File([csvBlob], 'something.csv', { type: 'text/csv' });

    this.tableHttp.putCreateStepCsvFile(
      this.currentProject.executionSideInfo?.ipPort as string,
      this.currentProject.name,
      fileName,
      csvFile
    )
 }
}
