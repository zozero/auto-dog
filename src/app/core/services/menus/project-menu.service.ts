import { Injectable } from '@angular/core';
import { MyLocalStorageService } from '../my-local-storage/my-local-storage.service';
import { projectTable } from '../dexie-db/project-table.service';
import { ProjectInfo } from '../../interface/config-type';

@Injectable({
  providedIn: 'root',
})
export class ProjectMenuService {
  constructor(private myLocalStorage: MyLocalStorageService) {}
  async initCurrentProject() {
    let currentProject: ProjectInfo;
    // 获取已保存的菜单
    const currentProjectName = this.myLocalStorage.get('currentProjectName');
    if (currentProjectName) {
      currentProject = await projectTable.queryProjectInfoByName(currentProjectName);
    } else {
      currentProject = await projectTable.queryProjectFirstInfo();
    }
    return currentProject;
  }
}
