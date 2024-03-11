import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import { MenuItemClickType, MenuItemType } from 'ng-devui/menu';
import { MyMenu } from './app-data';

const myMenu:MyMenu[]=[
    {
      menu:{
        key: 'c-1',
        icon: 'icon-more-func',
        name: '设置'
      },
      subMenu:[
        {
          key: 'c-1-1',
          icon: 'icon-more-func',
          name: '设置子项'
        },
        {
          key: 'c-1-2',
          icon: 'icon-more-func',
          name: '设置子项2'
        },
      ]
    },
    {
      menu:{
        key: 'c-2',
        icon: 'icon-more-func',
        name: '图片处理'
      },
      subMenu:[
        {
          key: 'c-2-1',
          icon: 'icon-more-func',
          name: '图片处理子项'
        },
        {
          key: 'c-2-2',
          icon: 'icon-more-func',
          name: '图片处理子项'
        },
      ]
    }
]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  menus = myMenu;
  menuSubs:MenuItemType[]=[];
  disabledKeys = ['c-1', 'c-2', 'c-3-1'];
  openKeys: string[] = ['c-3', 'c-2'];
  activeKey = 'c-1';
  activeKeySub='c-1-1';

  openChange(open: boolean, currentMenu:MyMenu) {
    if (open) {
      this.openKeys.push(currentMenu.menu.key);
    } else {
      this.openKeys = this.openKeys.filter(item => item !== currentMenu.menu.key);
    }
  }

  itemClick(key: string, currentMenu:MyMenu) {
    this.activeKey = key;
    this.menuSubs=currentMenu.subMenu;
    this.activeKeySub = this.menuSubs[0].key;
    console.log(this.menuSubs)
  }

  itemClickSub(key: string) {
    this.activeKeySub = key;
  }

  menuItemClick(event: MenuItemClickType) {
    console.log('menuItemClick', event);
  }

  trackByMenu(_: number, item: MenuItemType) {
    return item.key;
  }

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService
  ) {
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
}
