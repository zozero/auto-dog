import { Component, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'ng-devui/button';
import { DialogService, LayoutModule } from 'ng-devui';
import { SelectModule } from 'ng-devui/select';
import { FormsModule } from '@angular/forms';
import { SubMenusComponent } from '../shared/components/sub-menus/sub-menus.component';
import { ProjectInfo } from '../config/config-data';
import { CommonModule } from '@angular/common';
// 导入 angular-cropperjs 用于图片处理
import { AngularCropperjsModule, CropperComponent } from 'angular-cropperjs';
import { MenuService } from '../core/services/menus/menu.service';
import { CropImageUploadComponent } from '../shared/components/crop-image-upload/crop-image-upload.component';
import { TableHttpService } from '../core/services/https/table-http.service';

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
  cropImageBlobUrl: any;
  cropImageBlob!:Blob;

  // Get with @ViewChild
  @ViewChild('angularCropper') public angularCropper!: CropperComponent;

  constructor(
    private tableHttp: TableHttpService,
    private menu: MenuService,
    private dialogService: DialogService
  ) {}
  ngOnInit(): void {
    void this.menu.initCurrentSubMenu().then((data) => {
      this.currentSubMenu = data;
    });
  }

  toggleLoading() {
    this.showLoading = true;
    this.tableHttp
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
  // 导出截图，当执行图片导出时，组件会自动触发该函数
   angularCropperExport(data: any) {
    console.log(
      '🚀 ~ ImageProcessComponent ~ angularCropperExport ~ data:',
      data
    );
    this.cropImageBlob=data.blob
    this.cropImageBlobUrl =  URL.createObjectURL(this.cropImageBlob);
    console.log("🚀 ~ ImageProcessComponent ~ angularCropperExport ~ this.cropImageData :", this.cropImageBlobUrl )
    console.log("🚀 ~ ImageProcessComponent ~ angularCropperExport ~ this.imageBlob :", this.cropImageBlob)
    
    const imageInfo: Cropper.Data = this.getCropImageInfo();
    const rowImageInfo = this.getNaturalSize();
    const cropImageInfo = {
      image: this.cropImageBlobUrl,
      imageBlob:this.cropImageBlob,
      info: imageInfo,
      currentMenu: this.currentSubMenu,
      rowImageInfo: rowImageInfo,
    };
    console.log(
      '🚀 ~ ImageProcessComponent ~ angularCropperExport ~ cropImageInfo:',
      cropImageInfo
    );

    this.showUploadCropImage(cropImageInfo);
  }
  // 显示图片上传的对话框
  showUploadCropImage(imageData: any) {
    const config = {
      id: 'crop—image-dialog',
      maxWidth: '900px',
      maxHeight: '600px',
      title: '截图数据处理上传',
      content: CropImageUploadComponent,
      backdropCloseable: true,
      onClose: () => console.log('on dialog closed'),
    };

    const imageUploadDialogHandler = this.dialogService.open({
      ...config,
      showMaximizeBtn: true,
      dialogtype: 'standard',
      showAnimation: false,

      data: {
        imageData: imageData,
        close: () => {
          imageUploadDialogHandler.modalInstance.hide();
        },
      },
      buttons: [
        // {
        //   cssClass: 'primary',
        //   text: '确定',
        //   disabled: false,
        //   handler:
        // },
        // {
        //   id: 'btn-cancel',
        //   cssClass: 'common',
        //   text: '取消',
        //   handler: ($event: Event) => {
        //     console.log("🚀 ~ ImageProcessComponent ~ showUploadCropImage ~ $event:", $event)
        //     results.modalInstance.hide();
        //   },
        // },
      ],
    });
  }

  // 获取裁剪的图片信息
  getCropImageInfo() {
    // 获得当前图片显示区域的范围，包括离整个画板的距离
    // this.angularCropper.cropper.getCanvasData()z
    // 获得当前截取的图片的位置，其中x，y是原始大小的图片左上角开始的位置，width，height是截取的图片实际的大小
    // this.angularCropper.cropper.getData()
    const cropImageInfo: Cropper.Data = this.angularCropper.cropper.getData();
    return cropImageInfo;
  }

  getNaturalSize() {
    // 获取当前图片的尺寸(包括被缩小了的)
    // naturalHeight：原始高
    // naturalWidth：原始宽

    const imageInfo = this.angularCropper.cropper.getImageData();
    const rowImageInfo = {
      width: imageInfo.naturalWidth,
      height: imageInfo.naturalHeight,
    };

    return rowImageInfo;
  }

  // 重置画布内容
  resetCanvasImage() {
    if (this.imageToShow) {
      this.angularCropper.cropper.reset();
    }
  }
}
