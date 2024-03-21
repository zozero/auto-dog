import { Component, OnInit } from '@angular/core';
import { TableHttpService } from '../core/services/https/table-http.service';
import { ProjectInfo } from '../config/config-data';
import { MenuService } from '../core/services/menus/menu.service';
import { DevUIModule, LayoutModule, LoadingService } from 'ng-devui';
import { CommonModule } from '@angular/common';
import { SubMenusComponent } from '../shared/components/sub-menus/sub-menus.component';
import { LoadingModule } from 'ng-devui/loading';
import { ToastService } from 'ng-devui/toast';
import { ImageMatchTableComponent } from "./image-match-table/image-match-table.component";
import { TabsModule } from 'ng-devui/tabs';
import { matchMethodList } from '../shared/mock-data/match-mock';

@Component({
    selector: 'app-method-edit',
    standalone: true,
    templateUrl: './method-edit.component.html',
    styleUrl: './method-edit.component.scss',
    imports: [
        LayoutModule,
        CommonModule,
        SubMenusComponent,
        DevUIModule,
        LoadingModule,
        ImageMatchTableComponent,
        TabsModule
    ]
})
export class MethodEditComponent implements OnInit {
  currentSubMenu!: ProjectInfo;
  // 按钮点击后的载入提示
  btnShowLoading = false;
  imageMethodList=matchMethodList

  tabActiveId: string | number =matchMethodList[0]["名称"];
  activeTabData:any;
  tabItems = [
    {
      id: 'tab1',
      title: 'Tab1',
    },
    {
      id: 'tab2',
      title: 'Tab2',
    },
    {
      id: 'tab3',
      title: 'Tab3',
    },
  ];

  constructor(
    private tableHttp: TableHttpService,
    private menu: MenuService,
    private loadingService: LoadingService,
    private toastService: ToastService 
  ) {}

  ngOnInit(): void {
    
    // 数据载入提示
    const loadTip = this.loadingService.open();

    // 初始化时设置菜单，第一次启动和每次加载
    void this.menu
      .initCurrentSubMenu()
      .then((data) => {
        this.currentSubMenu = data;
        // this.getcsvFile();
      })
      .then(() => {
        // 关闭载入提示
        loadTip.loadingInstance.close();

      });
  }

  // 从子菜单组件中发送信息到这里，用于修改当前子菜单的信息。
  getCurrentSubMenu(currentSubMenu: ProjectInfo) {
    this.currentSubMenu = currentSubMenu;
  }
 
  activeTabChange(tab:any) {
    console.log(tab);
  }
  // 过滤使用，暂时没打算添加
  // onFirstFilterChange($event: any) {
  //   console.log(
  //     '🚀 ~ MethodEditComponent ~ onFirstFilterChange ~ event:',
  //     $event
  //   );
  //   this.csvData =  this.csvData.filter((data:string)=>{
  //     return data[1]===$event[0].value
  //   })
  // }

 
}
