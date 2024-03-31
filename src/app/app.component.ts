import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import {  AppMenuItemType } from './core/interface/app-type';
import { Router } from '@angular/router';
import { MyLocalStorageService } from './core/services/my-local-storage/my-local-storage.service';
import { ExecutionSideInfo, SimulatorInfo } from './core/interface/config-type';
import { myMenuListmyMenuList } from './core/mock/app-mock';

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
  menuList: AppMenuItemType[] = myMenuListmyMenuList;
  // 当前的主菜单，默认为配置
  currentMenu: AppMenuItemType = this.menuList[0];

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private router: Router,
    private myLocalStorage: MyLocalStorageService
  ) {
    this.getStoreMenu();
    this.setAutoExecute();
    this.setAutoSave();
    this.translate.setDefaultLang('zh');
    this.systemInfo();

  }

  // 设置保存的菜单
  getStoreMenu() {
    // 获取已保存的菜单
    const curMuen = this.myLocalStorage.get('currentMenu');
    this.menuList.forEach((d1) => {
      if (d1.name === curMuen) {
        this.currentMenu = d1;
        this.navigateCurMenu();
      }
    });
  }
  
  // 判断自动执行是否设置过，没有就赋值为自动状态
  setAutoExecute(){
    const tmpStr: string | null = this.myLocalStorage.get('autoExe');
    if (tmpStr === null || tmpStr===undefined) {
      this.myLocalStorage.set('autoExe', '1');
    }
  }
   // 判断自动保存是否设置过，没有就赋值为自动状态
   setAutoSave(){
    const tmpStr: string | null = this.myLocalStorage.get('autoSave');
    if (tmpStr === null || tmpStr===undefined) {
      this.myLocalStorage.set('autoSave', '1');
    }
  }

  // 主菜单栏某项被点击
  menuClick(currentMenu: AppMenuItemType) {
    this.currentMenu = currentMenu;
    this.myLocalStorage.set('currentMenu', this.currentMenu.name);
  }
  // 从本地存储中获取位置后跳转过去
  navigateCurMenu(){
    this.router
    .navigate([this.currentMenu.name,])
    .then(
      () => {
      },
      () => {
      }
    );
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
