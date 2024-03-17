import { Injectable } from '@angular/core';
import { MyLocalStorageService } from '../my-local-storage/my-local-storage.service';
import { projectTable } from '../dexie-db/project-table.service';
import { ProjectInfo } from '../../../config/config-data';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(private myLocalStorage: MyLocalStorageService) {}
  async initCurrentSubMenu() {
    let currentSubMenu: ProjectInfo;
    // 获取已保存的菜单
    const curMuen = this.myLocalStorage.get('currentSubMenu');
    console.log('🚀 ~ SubMenusComponent ~ getMenus ~ curMuen:', curMuen);
    if (curMuen) {
      currentSubMenu = await projectTable.queryProjectInfoByName(curMuen);
    } else {
      currentSubMenu = await projectTable.queryProjectFirstInfo();
    }
    return currentSubMenu;
  }
}
