import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'ng-devui/button';
import { DialogService, LayoutModule, TabsModule } from 'ng-devui';
import { ProjectMenusComponent } from '../../shared/components/project-menus/project-menus.component';
import { ProjectInfo } from '../../core/interface/config-type';
import { CommonModule } from '@angular/common';
import { ProjectMenuService } from '../../core/services/menus/project-menu.service';
import { ImageHttpService } from '../../core/services/https/image-http.service';
import { TipsDialogService } from '../../core/services/tips-dialog/tips-dialog.service';

import { TooltipModule } from 'ng-devui/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MyLocalStorageService } from '../../core/services/my-local-storage/my-local-storage.service';
import { InfiniteGalleryComponent } from "./infinite-gallery/infinite-gallery.component";
import { MatchMethodType } from '../../core/interface/table-type';
import { matchMethodTotalList } from '../../core/mock/match-mock';
import { cloneDeep } from 'lodash-es';


@Component({
  selector: 'app-image-gallery',
  standalone: true,
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.scss',
  imports: [
    ButtonModule,
    LayoutModule,
    ProjectMenusComponent,
    CommonModule,
    TooltipModule,
    TranslateModule,
    InfiniteGalleryComponent,
    TabsModule,
  ]
})
export class ImageGalleryComponent implements OnInit {
  currentProject!: ProjectInfo;
  imageMethodList: MatchMethodType[] = cloneDeep(matchMethodTotalList)

  tabActiveId: string | number = this.imageMethodList[0]["名称"];

  constructor(
    private imageHttp: ImageHttpService,
    private menu: ProjectMenuService,
    private dialogService: DialogService,
    private tipsService: TipsDialogService,
    private myLocalStorage: MyLocalStorageService
  ) { }

  ngOnInit(): void {
    void this.menu.initCurrentProject().then((data) => {
      this.currentProject = data;
    });
    // 只要保留前四个
    this.imageMethodList = this.imageMethodList.splice(0, 4)
  }

  // 从子菜单组件中发送信息到这里，用于修改当前子菜单的信息。
  getCurrentProject(currentProject: ProjectInfo) {
    this.currentProject = currentProject;
  }

  // activeTabChange(tab:any) {
  //   // console.log(tab);
  // }
}
