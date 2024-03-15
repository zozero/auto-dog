import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import {  MyMenuItemType } from './app-data';
import { Router } from '@angular/router';
import { ExecutionSideInfo, SimulatorInfo } from './config/config-data';
import { MyLocalStorageService } from './core/services/my-local-storage/my-local-storage.service';
import { myMenuListmyMenuList } from './shared/mock-data/config-mock';

// {
//   icon: 'icon-more-func',
//   name: '第七十四',
// },
// {
//   icon: 'icon-more-func',
//   name: '工作链路',
// },

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  simulatorInfoList!: SimulatorInfo[];
  executionSideInfoList!: ExecutionSideInfo[];

  currentSimulatorInfo!: SimulatorInfo;
  currentExecutionSide!: ExecutionSideInfo;

  // 完整的菜单栏
  menuList: MyMenuItemType[] = myMenuListmyMenuList;
  // 当前的主菜单
  currentMenu: MyMenuItemType = this.menuList[0];


  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private router: Router,
    private myLocalStorage: MyLocalStorageService
  ) {
    this.setStoreMenu();
    this.translate.setDefaultLang('en');

    this.systemInfo();
  }

  // 刷新或查询打开时设置当前菜单
  setOneMenu() {
    this.myLocalStorage.set('currentMenu', this.currentMenu.name);
  }

  // 设置保存的菜单
  setStoreMenu() {
    const curMuen = this.myLocalStorage.get('currentMenu');
    console.log("🚀 ~ AppComponent ~ setStoreMenu ~ curMuen:", curMuen)
    this.menuList.forEach((d1) => {
      if (d1.name === curMuen) {
        this.currentMenu = d1;
       
      }
    });
  }

  // 主菜单栏某项被点击
  menuClick(currentMenu: MyMenuItemType) {
    this.currentMenu = currentMenu;
  }

  systemInfo(){
    console.log('APP_CONFIG', APP_CONFIG);
    if (this.electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }
}
