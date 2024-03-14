import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import { MenuItemClickType } from 'ng-devui/menu';
import { MyMenu, MyMenuItemType } from './app-data';
import { Router } from '@angular/router';
import { ExecutionSideInfo, SimulatorInfo } from './config/config-data';
import { simulatorTable } from './core/services/dexie-db/simulato-table.service';
import { executionSideTable } from './core/services/dexie-db/execution-side-table.service';
import { configTable } from './core/services/dexie-db/config-table.service';
import { MyLocalStorageService } from './core/services/my-local-storage/my-local-storage.service';

const myMenuList: MyMenu[] = [
  {
    menu: {
      icon: 'icon-more-func',
      name: '配置',
    },
    subMenuList: [],
  },
  {
    menu: {
      icon: 'icon-more-func',
      name: '图片处理',
    },
    subMenuList: [
      {
        icon: 'icon-more-func',
        name: '第七十四',
      },
      {
        icon: 'icon-more-func',
        name: '工作链路',
      },
    ],
  },
  {
    menu: {
      icon: 'icon-more-func',
      name: '流程规划',
    },
    subMenuList: [
      {
        icon: 'icon-more-func',
        name: '第七十四',
      },
      {
        icon: 'icon-more-func',
        name: '工作链路',
      },
    ],
  },
];

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
  menuList: MyMenu[] = myMenuList;
  // 当前的主菜单
  currentMenu: MyMenu = this.menuList[0];
  // 子菜单列表，由于所有主菜单的子菜单相同，所以子菜单列表固定
  subMenuList: MyMenuItemType[] = [];
  // 当前子菜单
  currentSubMenu!: MyMenuItemType;

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private router: Router,
    private myLocalStorage: MyLocalStorageService
  ) {
    void this.setHttpDatas();

    // this.setOneMenu();
    this.setStoreMenu()

    this.translate.setDefaultLang('en');
    console.log('APP_CONFIG', APP_CONFIG);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  // 刷新或查询打开时设置当前菜单
  setOneMenu() {
    this.myLocalStorage.set('currentMenu', this.currentMenu.menu.name);
    this.myLocalStorage.set('currentSubMenu', this.currentSubMenu.name);
  }

  // 设置保存的菜单
  setStoreMenu() {
    const curMuen = this.myLocalStorage.get('currentMenu');
    console.log("🚀 ~ AppComponent ~ setStoreMenu ~ curMuen:", curMuen)
    this.menuList.forEach((d1) => {
      if (d1.menu.name === curMuen) {
        this.currentMenu = d1;
        this.subMenuList=this.currentMenu.subMenuList;
        const curSubMuen = this.myLocalStorage.get('currentSubMenu');
        this.currentMenu.subMenuList.forEach((d2) => {
          if (d2.name === curSubMuen) {
            this.currentSubMenu = d2;
            console.log("🚀 ~ AppComponent ~ this.currentMenu.subMenuList.forEach ~ this.currentSubMenu :", this.currentSubMenu )
          
          }
        });
      }
    });
  }

  // 主菜单栏某项被点击
  menuClick(currentMenu: MyMenu) {
    this.currentMenu = currentMenu;
    this.subMenuList = currentMenu.subMenuList;

    // 第一次点击菜单时”currentSubMenu“应该未初始话，现在初始化它
    if (!this.currentSubMenu && this.subMenuList && this.subMenuList.length) {
      this.currentSubMenu = this.subMenuList[0];
    }
  }

  // 子菜单栏某项被点击
  subMenuClick(subMenu: MyMenuItemType) {
    this.currentSubMenu = subMenu;
  }

  // 只要菜单被点击就触发，该触发事件在具体项点击事件之后。
  menuBoxClick(event: MenuItemClickType) {
    console.log('🚀 ~ AppComponent ~ menuBoxClick ~ menuBoxClick:');

    if (this.currentMenu.subMenuList && this.currentMenu.subMenuList.length) {
      this.router
        .navigate([this.currentMenu.menu.name, this.currentSubMenu?.name])
        .then(
          (nav) => {
            this.setOneMenu();
            
            console.log('🚀 ~ AppComponent ~ menuBoxClick ~ nav:', nav);
            console.log(nav); // true if navigation is successful
          },
          (err) => {
            console.log(err); // when there's an error
          }
        );
    } else {
      this.router.navigate([this.currentMenu.menu.name]).then(
        (nav) => {
          this.setOneMenu();

          console.log('🚀 ~ AppComponent ~ menuBoxClick ~ nav:', nav);
          console.log(nav); // true if navigation is successful
        },
        (err) => {
          console.log(err); // when there's an error
        }
      );
    }
    console.log('menuItemClick', event);
  }

  // 设置当前需要传输的网络地址，即执行端地址和模拟器地址
  async setHttpDatas() {
    console.log("🚀 ~ AppComponent ~ setHttpDatas ~ setHttpDatas:")
    // 获取所有数据
    this.executionSideInfoList =
      await executionSideTable.queryAllExecutionSideInfos();
    this.simulatorInfoList = await simulatorTable.queryAllSimulatorInfos();

    // 判断数据库是否已经存在执行端和模拟器端的数据，是的话读取
    const oneSimulatorInfo = await configTable.getOneConfigData();
    if (
      oneSimulatorInfo?.currentExecutionSideInfo &&
      oneSimulatorInfo?.currentSimulatorInfo
    ) {
      this.currentExecutionSide = oneSimulatorInfo.currentExecutionSideInfo;
      this.currentSimulatorInfo = oneSimulatorInfo.currentSimulatorInfo;
    } else {
      this.currentExecutionSide = this.executionSideInfoList[0];
      this.currentSimulatorInfo = this.simulatorInfoList[0];
      await this.onSelectEditEnd('');
    }
  }

  // 更新数据
  async selectClickUpdateDatas(type: string) {
    switch (type) {
      case '执行端':
        this.executionSideInfoList =
          await executionSideTable.queryAllExecutionSideInfos();
        break;
      case '模拟器端':
        this.simulatorInfoList = await simulatorTable.queryAllSimulatorInfos();
        break;
      default:
        break;
    }
  }

  // 更新配置数据
  async onSelectEditEnd(type: string) {
    console.log("🚀 ~ AppComponent ~ onSelectEditEnd ~ onSelectEditEnd:")
    switch (type) {
      case '执行端':
        await configTable.updateData({
          currentExecutionSideInfo: this.currentExecutionSide,
        });
        break;
      case '模拟器端':
        await configTable.updateData({
          currentSimulatorInfo: this.currentSimulatorInfo,
        });
        break;
      default:
        await configTable.updateData({
          currentExecutionSideInfo: this.currentExecutionSide,
        });
        await configTable.updateData({
          currentSimulatorInfo: this.currentSimulatorInfo,
        });
        break;
    }
  }

  keepMenu(menu: string, subMenu: string) {
    console.log('🚀 ~ AppComponent ~ keepMenu ~ menu:', menu);
    this.currentMenu.menu.name = menu;
    this.currentSubMenu.name = subMenu;
  }
}
