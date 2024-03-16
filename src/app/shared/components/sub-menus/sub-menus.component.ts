import {  Output, EventEmitter ,Component, OnInit } from '@angular/core';
import { MyLocalStorageService } from '../../../core/services/my-local-storage/my-local-storage.service';
import { LayoutModule } from 'ng-devui/layout';
import { MenuModule } from 'ng-devui/menu';
import { projectTable } from '../../../core/services/dexie-db/project-table.service';
import { ProjectInfo } from '../../../config/config-data';
import { CommonModule } from '@angular/common';
import { findIndex } from 'lodash';
import { HttpSelectComponent } from "../http-select/http-select.component";
import { ButtonModule } from 'ng-devui/button';

@Component({
    selector: 'app-sub-menus',
    standalone: true,
    templateUrl: './sub-menus.component.html',
    styleUrl: './sub-menus.component.scss',
    imports: [LayoutModule, MenuModule, CommonModule, HttpSelectComponent,ButtonModule]
})
export class SubMenusComponent implements OnInit {
  @Output() sendCurrentSubMenu = new EventEmitter<ProjectInfo>();
  // 子菜单列表，由于所有主菜单的子菜单相同，所以子菜单列表固定
  subMenuList: ProjectInfo[] = [];
  // 当前子菜单
  currentSubMenu!: ProjectInfo;
  // 当前索引，用户便捷修改列表数据
  currentIndex:number=0
  constructor(private myLocalStorage: MyLocalStorageService) {}
  ngOnInit(): void {
    void this.getMenus();
  }

  async getMenus(){
    this.subMenuList=await projectTable.queryAllProjectInfos();
    // 获取已保存的菜单
    const curMuen = this.myLocalStorage.get('currentSubMenu');
    console.log("🚀 ~ SubMenusComponent ~ getMenus ~ curMuen:", curMuen)
    if(curMuen){
      this.currentIndex=findIndex(this.subMenuList,{'name':curMuen})
      this.currentSubMenu = this.subMenuList[this.currentIndex];
      console.log("🚀 ~ SubMenusComponent ~ getMenus ~ this.currentSubMenu:", this.currentSubMenu)
    }
    else{
      this.currentIndex=0
      this.currentSubMenu =this.subMenuList[this.currentIndex];
    }
    
  }
  // 子菜单栏某项被点击
  subMenuClick(index:number,subMenu: ProjectInfo) {
    this.currentSubMenu = subMenu;
    this.myLocalStorage.set('currentSubMenu', this.currentSubMenu.name);
    
    this.currentIndex=index
    this.sendCurrentSubMenu.emit(this.currentSubMenu);
  }

}
