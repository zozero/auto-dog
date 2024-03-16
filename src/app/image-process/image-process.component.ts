import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'ng-devui/button';
import { LayoutModule } from 'ng-devui';
import { SelectModule } from 'ng-devui/select';
import { FormsModule } from '@angular/forms';
import { SubMenusComponent } from '../shared/components/sub-menus/sub-menus.component';
import { ProjectInfo } from '../config/config-data';
import { ExecutionSideHttpService } from '../core/services/https/execution-side-http.service';
import { CommonModule } from '@angular/common';
import { MyLocalStorageService } from '../core/services/my-local-storage/my-local-storage.service';
import { projectTable } from '../core/services/dexie-db/project-table.service';

@Component({
  selector: 'app-image-process',
  standalone: true,
  templateUrl: './image-process.component.html',
  styleUrl: './image-process.component.scss',
  imports: [
    ButtonModule,
    LayoutModule,
    SelectModule,
    FormsModule,
    SubMenusComponent,
    CommonModule
  ],
})
export class ImageProcessComponent implements OnInit {
  currentSubMenu!: ProjectInfo;
  showLoading = false;
  imageToShow: any;

  constructor(
    private route: ActivatedRoute,
    private executionSideHttp: ExecutionSideHttpService,
    private myLocalStorage: MyLocalStorageService
  ) {}
  ngOnInit(): void {
    void this.initCurrentSubMenu();
  }

  async initCurrentSubMenu(){
    // 获取已保存的菜单
    const curMuen = this.myLocalStorage.get('currentSubMenu');
    console.log("🚀 ~ SubMenusComponent ~ getMenus ~ curMuen:", curMuen)
    if(curMuen){
      this.currentSubMenu = await projectTable.queryProjectInfoByName(curMuen);
      console.log("🚀 ~ SubMenusComponent ~ getMenus ~ this.currentSubMenu:", this.currentSubMenu)
    }
    else{
      this.currentSubMenu =await projectTable.queryProjectFirstInfo();
    }
  }

  toggleLoading() {
    this.showLoading = true;
    this.executionSideHttp
      .interceptImage(
        this.currentSubMenu.executionSideInfo.ipPort,
        this.currentSubMenu.simulatorInfo.ipPort
      )
      .subscribe((img) => {
        console.log("🚀 ~ ImageProcessComponent ~ .subscribe ~ img:", img)
        
        const reader = new FileReader();
        reader.addEventListener(
          'load',
          () => {
            this.imageToShow = reader.result;
            console.log("🚀 ~ ImageProcessComponent ~ .subscribe ~  this.imageToShow:",  this.imageToShow)
            this.showLoading = false;
          },
          false
        );

        if (img) {
          reader.readAsDataURL(img);
        }
      });

    // setTimeout(() => {
    // }, 1000);
  }

  getCurrentSubMenu(currentSubMenu: ProjectInfo) {
    console.log(
      '🚀 ~ ImageProcessComponent ~ addItem ~ newItem:',
      currentSubMenu
    );
    this.currentSubMenu = currentSubMenu;
  }

  turnGray(){
    
  }
}
