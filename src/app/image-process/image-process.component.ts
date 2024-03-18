import { Component, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'ng-devui/button';
import { LayoutModule } from 'ng-devui';
import { SelectModule } from 'ng-devui/select';
import { FormsModule } from '@angular/forms';
import { SubMenusComponent } from '../shared/components/sub-menus/sub-menus.component';
import { ProjectInfo } from '../config/config-data';
import { ExecutionSideHttpService } from '../core/services/https/execution-side-http.service';
import { CommonModule } from '@angular/common';
// 导入 angular-cropperjs 用于图片处理
import { AngularCropperjsModule, CropperComponent } from 'angular-cropperjs';
import { MenuService } from '../core/services/menus/menu.service';

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
    CommonModule,
    AngularCropperjsModule,
  ],
})
export class ImageProcessComponent implements OnInit {
  currentSubMenu!: ProjectInfo;
  showLoading = false;
  cropConfig = {
    // 双击后可以拖动图片，再次双击后恢复
    // toggleDragModeOnDblclick:true
    // 根据百分比设置初始截取范围框，根据图片的大小
    autoCropArea: 0.2,
  };
  imageToShow: any;
  cropImageData: any;

  // Get with @ViewChild
  @ViewChild('angularCropper') public angularCropper!: CropperComponent;

  constructor(
    private executionSideHttp: ExecutionSideHttpService,
    private menu: MenuService
  ) {}
  ngOnInit(): void {
    void this.menu.initCurrentSubMenu().then((data) => {
      this.currentSubMenu = data;
    });
  }

  toggleLoading() {
    this.showLoading = true;
    this.executionSideHttp
      .interceptImage(
        this.currentSubMenu.executionSideInfo.ipPort,
        this.currentSubMenu.simulatorInfo.ipPort
      )
      .subscribe((img) => {
        console.log('🚀 ~ ImageProcessComponent ~ .subscribe ~ img:', img);

        const reader = new FileReader();
        reader.addEventListener(
          'load',
          () => {
            this.imageToShow = reader.result;
            // console.log("🚀 ~ ImageProcessComponent ~ .subscribe ~  this.imageToShow:",  this.imageToShow)
            this.showLoading = false;
          },
          false
        );

        if (img) {
          reader.readAsDataURL(img);
        }
      })
      .add(() => (this.showLoading = false));
    // setTimeout(() => {
    // }, 1000);
  }

  getCurrentSubMenu(currentSubMenu: ProjectInfo) {
    this.currentSubMenu = currentSubMenu;
  }

  cropImage() {
    if (this.imageToShow) {
      this.angularCropper.exportCanvas();
    }
  }
  angularCropperExport(data: any) {
    console.log('🚀 ~ ImageProcessComponent ~ test1 ~ data:', data);
    this.cropImageData = this.angularCropper.cropper
      .getCroppedCanvas()
      .toDataURL('image/jpeg');
    this.getCropImageInfo();
  }
  getCropImageInfo() {
    // 获取当前图片的尺寸(可能被缩小了)
    // this.angularCropper.cropper.getImageData()
    // 获得当前图片显示区域的范围，包括离整个画板的距离
    // this.angularCropper.cropper.getCanvasData()z
    // 获得当前截取的图片的位置，其中x，y是原始大小的图片左上角开始的位置，width，height是截取的图片实际的大小
    // this.angularCropper.cropper.getData()
    const cropImageInfo = this.angularCropper.cropper.getData();
    console.log(cropImageInfo);
  }

  resetCanvasImage() {
    if (this.imageToShow) {
      this.angularCropper.cropper.reset();
    }
  }
}
