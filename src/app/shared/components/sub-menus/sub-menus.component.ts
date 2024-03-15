import { Component, OnInit } from '@angular/core';
import { MyMenuItemType } from '../../../app-data';
import { MyLocalStorageService } from '../../../core/services/my-local-storage/my-local-storage.service';
import { LayoutModule } from 'ng-devui/layout';
import { MenuModule } from 'ng-devui/menu';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-sub-menus',
  standalone: true,
  imports: [LayoutModule, MenuModule, BrowserModule, BrowserAnimationsModule],
  templateUrl: './sub-menus.component.html',
  styleUrl: './sub-menus.component.scss',
})
export class SubMenusComponent implements OnInit {
  // 子菜单列表，由于所有主菜单的子菜单相同，所以子菜单列表固定
  subMenuList: MyMenuItemType[] = [];
  // 当前子菜单
  currentSubMenu!: MyMenuItemType;
  constructor(private myLocalStorage: MyLocalStorageService) {}
  ngOnInit(): void {
    this.myLocalStorage.set('currentSubMenu', this.currentSubMenu.name);
  }
  // 子菜单栏某项被点击
  subMenuClick(subMenu: MyMenuItemType) {
    this.currentSubMenu = subMenu;
  }
  // 主菜单栏某项被点击
  menuClick(currentMenu: MyMenuItemType) {
    console.log(
      '🚀 ~ SubMenusComponent ~ menuClick ~ currentMenu:',
      currentMenu
    );

    // this.subMenuList = currentMenu.subMenuList;
    //   // 第一次点击菜单时”currentSubMenu“应该未初始话，现在初始化它
    //   if (!this.currentSubMenu && this.subMenuList && this.subMenuList.length) {
    //     this.currentSubMenu = this.subMenuList[0];
    //   }
  }
}
