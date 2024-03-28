import {  Output, EventEmitter ,Component, OnInit } from '@angular/core';
import { MyLocalStorageService } from '../../../core/services/my-local-storage/my-local-storage.service';
import { LayoutModule } from 'ng-devui/layout';
import { MenuModule } from 'ng-devui/menu';
import { projectTable } from '../../../core/services/dexie-db/project-table.service';
import { CommonModule } from '@angular/common';
import { findIndex } from 'lodash-es';
import { HttpSelectComponent } from "../http-select/http-select.component";
import { ButtonModule } from 'ng-devui/button';
import { ProjectInfo } from '../../../core/interface/config-type';

@Component({
    selector: 'app-project-menus',
    standalone: true,
    templateUrl: './project-menus.component.html',
    styleUrl: './project-menus.component.scss',
    imports: [LayoutModule, MenuModule, CommonModule, HttpSelectComponent,ButtonModule]
})
export class ProjectMenusComponent implements OnInit {
  @Output() sendCurrentProject = new EventEmitter<ProjectInfo>();
  // 子菜单列表，由于所有主菜单的子菜单相同，所以子菜单列表固定
  projectList: ProjectInfo[] = [];
  // 当前子菜单
  currentProject!: ProjectInfo;
  // 当前索引，用户便捷修改列表数据
  currentIndex:number=0
  constructor(private myLocalStorage: MyLocalStorageService) {}
  ngOnInit(): void {
    void this.getProjectList();
  }

  async getProjectList(){
    this.projectList=await projectTable.queryAllProjectInfos();
    // 获取已保存的菜单
    const curMuen = this.myLocalStorage.get('currentProjectName');
    if(curMuen){
      this.currentIndex=findIndex(this.projectList,{'name':curMuen})
      this.currentProject = this.projectList[this.currentIndex];
    }
    else{
      this.currentIndex=0
      this.currentProject =this.projectList[this.currentIndex];
    }
    
  }
  // 子菜单栏某项被点击
  subMenuClick(index:number,subMenu: ProjectInfo) {
    this.currentProject = subMenu;
    this.myLocalStorage.set('currentProjectName', this.currentProject.name);
    
    this.currentIndex=index
    this.sendCurrentProject.emit(this.currentProject);
  }

}
