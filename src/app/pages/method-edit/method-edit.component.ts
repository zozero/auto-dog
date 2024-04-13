import { Component, OnInit } from '@angular/core';
import { TableHttpService } from '../../core/services/https/table-http.service';
import { ProjectMenuService } from '../../core/services/menus/project-menu.service';
import { DevUIModule, LayoutModule, LoadingService } from 'ng-devui';
import { CommonModule } from '@angular/common';
import { ProjectMenusComponent } from '../../shared/components/project-menus/project-menus.component';
import { LoadingModule } from 'ng-devui/loading';
import { ToastService } from 'ng-devui/toast';
import { ImageMatchTableComponent } from "./image-match-table/image-match-table.component";
import { TabsModule } from 'ng-devui/tabs';
import { matchMethodTotalList } from '../../core/mock/match-mock';
import { ProjectInfo } from '../../core/interface/config-type';
import { MatchMethodType } from '../../core/interface/table-type';
import { BinaryImageMatchTableComponent } from "./binary-image-match-table/binary-image-match-table.component";
import { MatchAndMatchTableComponent } from "./match-and-match-table/match-and-match-table.component";
import { NoImageMatchTableComponent } from './no-image-match-table/no-image-match-table.component';
import { MultiImageMatchTableComponent } from "./multi-image-match-table/multi-image-match-table.component";
import { cloneDeep } from 'lodash-es';
import { YoloMatchTableComponent } from "./yolo-match-table/yolo-match-table.component";

@Component({
    selector: 'app-method-edit',
    standalone: true,
    templateUrl: './method-edit.component.html',
    styleUrl: './method-edit.component.scss',
    imports: [
        LayoutModule,
        CommonModule,
        ProjectMenusComponent,
        DevUIModule,
        LoadingModule,
        ImageMatchTableComponent,
        TabsModule,
        BinaryImageMatchTableComponent,
        MatchAndMatchTableComponent,
        NoImageMatchTableComponent,
        MultiImageMatchTableComponent,
        YoloMatchTableComponent
    ]
})
export class MethodEditComponent implements OnInit {
  currentProject!: ProjectInfo;

  imageMethodList:MatchMethodType[] =cloneDeep(matchMethodTotalList)

  tabActiveId: string | number =this.imageMethodList[0]["名称"];

  constructor(
    private tableHttp: TableHttpService,
    private menu: ProjectMenuService,
    private loadingService: LoadingService,
    private toastService: ToastService 
  ) {}

  ngOnInit(): void {
    
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
    this.currentProject = currentProject;
  }
 
  // activeTabChange(tab:any) {
    // console.log(tab);
  // }
  // 过滤使用，暂时没打算添加
  // onFirstFilterChange($event: any) {
  //   // console.log(
  //     '🚀 ~ MethodEditComponent ~ onFirstFilterChange ~ event:',
  //     $event
  //   );
  //   this.csvData =  this.csvData.filter((data:string)=>{
  //     return data[1]===$event[0].value
  //   })
  // }

 
}
