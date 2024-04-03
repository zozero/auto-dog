import { Component, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'ng-devui/button';
import { DialogService, LayoutModule } from 'ng-devui';
import { SelectModule } from 'ng-devui/select';
import { FormsModule } from '@angular/forms';
import { ProjectMenusComponent } from '../../shared/components/project-menus/project-menus.component';
import { ProjectInfo } from '../../core/interface/config-type';
import { CommonModule } from '@angular/common';
// 导入 angular-cropperjs 用于图片处理
import { AngularCropperjsModule, CropperComponent } from 'angular-cropperjs';
import { ProjectMenuService } from '../../core/services/menus/project-menu.service';
import { CropImageUploadComponent } from './crop-image-upload/crop-image-upload.component';
import { CropImageInfo, RowImageInfo, ImageInfo } from '../../core/interface/image-type';
import { ImageHttpService } from '../../core/services/https/image-http.service';
import { TipsDialogService } from '../../core/services/tips-dialog/tips-dialog.service';
import { ToggleModule } from 'ng-devui/toggle';
import { TooltipModule } from 'ng-devui/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MyLocalStorageService } from '../../core/services/my-local-storage/my-local-storage.service';
import { IconModule } from 'ng-devui/icon';

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
    ProjectMenusComponent,
    CommonModule,
    TooltipModule,
    AngularCropperjsModule,
    TranslateModule,
    ToggleModule,
    IconModule
  ],
})
export class ImageProcessComponent implements OnInit {
  currentProject!: ProjectInfo;
  // 点击按钮与执行端交互的进行时提示
  showLoading = false;
  // 裁剪的配件
  cropConfig = {
    // 双击后可以拖动图片，再次双击后恢复
    // toggleDragModeOnDblclick:true
    // 根据百分比设置初始截取范围框，根据图片的大小
    autoCropArea: 0.2,
  };
  // 原图地址，即模拟器的屏幕
  rowImageUrl!: string;
  // 裁剪后的图片地址
  cropImageBlobUrl!: string;
  // 裁剪后的图片
  cropImageBlob!: Blob;
  // 是自动执行一次
  isAutoExe: boolean = true;

  // 获取裁剪节点
  @ViewChild('angularCropper') public angularCropper!: CropperComponent;

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

    const tmpStr: string | null = this.myLocalStorage.get('autoExe');
    if (tmpStr !=null) {
      this.isAutoExe = Boolean(tmpStr);
    }

  }

  // 让执行端取截模拟的图
  toggleLoading() {
    this.showLoading = true;
    this.imageHttp
      .interceptImage(
        this.currentProject.executionSideInfo?.ipPort as string,
        this.currentProject.simulatorInfo?.ipPort as string
      )
      .subscribe({
        next: (img: Blob) => {
          this.rowImageUrl = URL.createObjectURL(img);
        },
        error: (err: any) => {
          this.tipsService.responseErrorState(err.status as number)
          // 关闭载入效果
          this.showLoading = false
        },
        complete: () => {
          // 关闭载入效果
          this.showLoading = false
        }
      })


  }

  getCurrentProject(currentProject: ProjectInfo) {
    this.currentProject = currentProject;
  }
  // 截图后会自动触发angularCropperExport函数
  cropImage() {
    if (this.rowImageUrl) {
      this.angularCropper.exportCanvas();
    }
  }
  // 导出截图，当执行图片导出时，组件会自动触发该函数
  angularCropperExport(data: any) {
    this.cropImageBlob = data.blob
    this.cropImageBlobUrl = URL.createObjectURL(this.cropImageBlob);
    const imageInfo: ImageInfo = this.getCropImageInfo();
    const rowImageInfo = this.getNaturalSize();
    const cropImageInfo: CropImageInfo = {
      url: this.cropImageBlobUrl,
      blob: this.cropImageBlob,
      info: imageInfo,
      rowImageInfo: rowImageInfo,
    };

    this.showUploadCropImage(cropImageInfo);
  }
  // 显示图片上传的对话框
  showUploadCropImage(imageData: CropImageInfo) {
    const config = {
      id: 'crop—image-dialog',
      maxWidth: '900px',
      maxHeight: '600px',
      title: '截图数据处理上传',
      content: CropImageUploadComponent,
      backdropCloseable: true,
      // onClose: () => // console.log('on dialog closed'),
    };

    const imageUploadDialogHandler = this.dialogService.open({
      ...config,
      showMaximizeBtn: true,
      dialogtype: 'standard',
      showAnimation: false,
      data: {
        imageData: imageData,
        projectInfo: this.currentProject,
        close: () => {
          imageUploadDialogHandler.modalInstance.hide();
        },
      },
      buttons: [
      ],
    });
  }

  // 获取裁剪的图片信息
  getCropImageInfo() {
    // 获得当前图片显示区域的范围，包括离整个画板的距离
    // this.angularCropper.cropper.getCanvasData()z
    // 获得当前截取的图片的位置，其中x，y是原始大小的图片左上角开始的位置，width，height是截取的图片实际的大小
    // this.angularCropper.cropper.getData()
    const cropImageInfo: ImageInfo = this.angularCropper.cropper.getData();
    return cropImageInfo;
  }

  getNaturalSize() {
    // 获取当前图片的尺寸(包括被缩小了的)
    // naturalHeight：原始高
    // naturalWidth：原始宽

    const imageInfo = this.angularCropper.cropper.getImageData();
    const rowImageInfo: RowImageInfo = {
      width: imageInfo.naturalWidth,
      height: imageInfo.naturalHeight,
    };

    return rowImageInfo;
  }

  // 重置画布内容
  resetCanvasImage() {
    if (this.rowImageUrl) {
      this.angularCropper.cropper.reset();
    }
  }
  
  // 改变自动执行的状态
  onChageAutoExe($event: any) {
    if($event){
      this.myLocalStorage.set('autoExe', '1')
    }
    else{
      this.myLocalStorage.set('autoExe', '')
    }
  }
}
