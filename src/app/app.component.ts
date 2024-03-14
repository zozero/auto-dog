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
  currentSubMenu: MyMenuItemType | undefined;

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private router: Router
  ) {
    void this.setHttpDatas();

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
            console.log(nav); // true if navigation is successful
          },
          (err) => {
            console.log(err); // when there's an error
          }
        );
    } else {
      this.router.navigate([this.currentMenu.menu.name]).then(
        (nav) => {
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
    this.simulatorInfoList = await simulatorTable.queryAllSimulatorInfos();
    this.currentSimulatorInfo = this.simulatorInfoList[0];
    this.executionSideInfoList =
      await executionSideTable.queryAllExecutionSideInfos();
    this.currentExecutionSide = this.executionSideInfoList[0];
    this.onSelectEditEnd('');
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
  onSelectEditEnd(type: string) {
    switch (type) {
      case '执行端':
        void configTable.updateData({"currentExecutionSideInfo":this.currentExecutionSide});
        break;
      case '模拟器端':
        void configTable.updateData({"currentSimulatorInfo":this.currentSimulatorInfo});
        break;
      default:
        void configTable.updateData({"currentExecutionSideInfo":this.currentExecutionSide});
        void configTable.updateData({"currentSimulatorInfo":this.currentSimulatorInfo});
        break;
    }
  }
}
