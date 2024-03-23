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
import { MatchMethodType } from '../../core/interface/table-type';

@Component({
  selector: 'app-setp-edit',
  standalone: true,
  imports: [
    LayoutModule,
    CommonModule,
    ProjectMenusComponent,
    DevUIModule,
    LoadingModule,
    TabsModule
  ],
  templateUrl: './setp-edit.component.html',
  styleUrl: './setp-edit.component.scss'
})
export class SetpEditComponent implements OnInit  {
  currentProject!: ProjectInfo;
  // 按钮点击后的载入提示
  // showLoading = false;
  imageMethodList:MatchMethodType[] =matchMethodList

  tabActiveId: string | number =matchMethodList[0]["名称"];
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
}
