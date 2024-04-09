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
import { CropImageInfo, RowImageInfo, ImageInfo, ScreenshotInfo, UploadCropArgs } from '../../core/interface/image-type';
import { ImageHttpService } from '../../core/services/https/image-http.service';
import { TipsDialogService } from '../../core/services/tips-dialog/tips-dialog.service';
import { ToggleModule } from 'ng-devui/toggle';
import { TooltipModule } from 'ng-devui/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MyLocalStorageService } from '../../core/services/my-local-storage/my-local-storage.service';
import { IconModule } from 'ng-devui/icon';
import { InputNumberModule } from 'ng-devui';
import { interval, take } from 'rxjs';
import { CropTabsComponent } from "./crop-tabs/crop-tabs.component";
import { ScreenshotTabsComponent } from './screenshot-tabs/screenshot-tabs.component';
import { MultiCropUploadComponent } from './multi-crop-upload/multi-crop-upload.component';

@Component({
  selector: 'app-multi-image-process',
  standalone: true,
  templateUrl: './multi-image-process.component.html',
  styleUrl: './multi-image-process.component.scss',
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
    IconModule,
    InputNumberModule,
    ScreenshotTabsComponent,
    CropTabsComponent
  ]
})
export class MultiImageProcessComponent implements OnInit {
  currentProject!: ProjectInfo;
  // 截屏次数
  screenshotCount = 2;
  //每次截屏间隔
  screenshotInterval = 0.3;
  // 点击按钮与执行端交互的进行时提示
  showLoading = false;
  // 用于计算载入关闭的时间
  showLoadingCount = 1;
  // 裁剪的配件
  cropConfig = {
    // 双击后可以拖动图片，再次双击后恢复
    // toggleDragModeOnDblclick:true
    // 根据百分比设置初始截取范围框，根据图片的大小
    autoCropArea: 0.2
  };
  // 截屏图片列表
  screenshotList: ScreenshotInfo[] = [];
  // 当前截屏栏的活跃id
  currentScreenshotTabId = 0;
  // 原图地址，即模拟器的屏幕
  currentScreenshotUrl: string = '';
  currentCropList: CropImageInfo[] = []

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
    if (tmpStr != null) {
      this.isAutoExe = Boolean(tmpStr);
    }

  }

  // 让执行端取截模拟的屏幕
  onScreenshot() {
    this.showLoading = true;
    this.showLoadingCount = 1;

    // 计算间隔时长。
    const durationNum = Math.floor(this.screenshotInterval * 1000);
    // 设置rxjs的间隔方法。
    const intervalHandle = interval(durationNum);
    // 设置间隔方法的次数，并订阅。
    intervalHandle.pipe(take(this.screenshotCount)).subscribe({
      next: () => {
        // 去发送截屏的请求
        this.onRequestScreenShot();
      }
    }
    )
  }

  // 请求模拟器的屏幕截图数据
  onRequestScreenShot() {
    this.imageHttp
      .interceptImage(
        this.currentProject.executionSideInfo?.ipPort as string,
        this.currentProject.simulatorInfo?.ipPort as string
      )
      .subscribe({
        next: (img: Blob) => {
          const tmpUrl = URL.createObjectURL(img);
          // 设置图片宽度和高度
          this.getImageBlobSize(img).then(size => {
            this.screenshotList.push({
              url: tmpUrl,
              blob: img,
              width: size.width,
              height: size.height,
              cropImageInfos: []
            })
          }).catch(error => {
            console.error(error.message);
          });
          if (this.currentScreenshotUrl === '') {
            this.currentScreenshotUrl = tmpUrl;
          }
        },
        error: (err: any) => {
          this.tipsService.responseErrorState(err.status as number)
          // 关闭载入效果
          this.showLoading = false
        },
        complete: () => {
          if (this.screenshotCount === this.showLoadingCount) {
            // 关闭载入效果
            this.showLoading = false
          }
          else {
            this.showLoadingCount++
          }
        }
      })
  }

  // 当前项目更改后会自动触发。
  getCurrentProject(currentProject: ProjectInfo) {
    this.currentProject = currentProject;
    // 切换项目就清空数据
    this.screenshotList = [];
    this.currentScreenshotUrl = ''
  }

  // 截图
  onCropImage() {
    if (this.currentScreenshotUrl !== '') {
      this.angularCropper.exportCanvas();
    }
  }

  // 截图后会自动触发angularCropperExport函数
  submitCropImage() {
    this.showMultiCropUpload();
  }
  // 导出截图，当执行图片导出时，组件会自动触发该函数
  angularCropperExport(data: any) {
    const cropImageInfo = this.setDataInCropImageInfo(data.blob as Blob)
    // 推送数据到截屏列表
    this.screenshotList[this.currentScreenshotTabId].cropImageInfos.push(cropImageInfo)
    this.currentCropList = this.screenshotList[this.currentScreenshotTabId].cropImageInfos;

  }

  // 设置数据到裁剪图片信息中
  setDataInCropImageInfo(data: Blob) {
    const cropImageBlob = data;
    const cropImageBlobUrl = URL.createObjectURL(cropImageBlob);
    const imageInfo: ImageInfo = this.getCropImageInfo();
    const rowImageInfo = this.getNaturalSize();
    const cropImageInfo: CropImageInfo = {
      url: cropImageBlobUrl,
      blob: cropImageBlob,
      info: imageInfo,
      rowImageInfo: rowImageInfo,

    };
    // 推送裁剪的专用于人工智能算法yolo的参数
    cropImageInfo.cropArgs = this.calculateUploadCropArgs(imageInfo, rowImageInfo);
    return cropImageInfo;
  }

  // 计算专用于人工智能算法yolo的参数
  calculateUploadCropArgs(imageInfo: ImageInfo, rowImageInfo: RowImageInfo): UploadCropArgs {
    // 计算比例中心点，保留小数点后6位
    let centerX = (imageInfo.x + imageInfo.width / 2) / rowImageInfo.width
    centerX = parseFloat(centerX.toFixed(6))
    let centerY = (imageInfo.y + imageInfo.height / 2) / rowImageInfo.height
    centerY = parseFloat(centerY.toFixed(6))
    // 计算比例尺寸，保留小数点后6位
    const imgSizeWidth = parseFloat((imageInfo.width / rowImageInfo.width).toFixed(6))
    const imgSizeHeight = parseFloat((imageInfo.height / rowImageInfo.height).toFixed(6))

    const args: UploadCropArgs = {
      比例中心点: [centerX, centerY],
      比例尺寸: [imgSizeWidth, imgSizeHeight]
    }
    return args
  }


  // 显示图片上传的对话框
  showMultiCropUpload() {
    const config = {
      id: 'multi-crop—Upload-dialog',
      maxWidth: '900px',
      maxHeight: '800px',
      title: '多图数据上传',
      content: MultiCropUploadComponent,
      backdropCloseable: true,
      // onClose: () => // console.log('on dialog closed'),
    };

    const imageUploadDialogHandler = this.dialogService.open({
      ...config,
      showMaximizeBtn: true,
      dialogtype: 'standard',
      showAnimation: false,
      data: {
        screenshotList: this.screenshotList,
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
    // 清空数据
    this.screenshotList = [];
    if (this.currentScreenshotUrl !== '') {
      this.angularCropper.cropper.reset();
    }
    this.currentScreenshotUrl = ''
  }

  // 改变自动执行的状态
  onChageAutoExe($event: any) {
    if ($event) {
      this.myLocalStorage.set('autoExe', '1')
    }
    else {
      this.myLocalStorage.set('autoExe', '')
    }
  }

  // 获取图片的宽高
  getImageBlobSize(blob: Blob): Promise<{ width: number, height: number }> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        resolve({ width: image.width, height: image.height });
      };
      image.onerror = () => {
        reject(new Error('无法加载图片'));
      };
      image.src = URL.createObjectURL(blob);
    });
  }

  // 改变了截图栏
  onChangeScreenshotTab($event: number) {
    this.currentScreenshotTabId = $event;
    this.currentScreenshotUrl = this.screenshotList[$event].url;
    this.currentCropList = this.screenshotList[$event].cropImageInfos;
  }

  // 同区连剪
  async onCutSameArea() {
    if (this.screenshotList.length > 0) {
      const cropImageInfo = this.getCropImageInfo();
      for (let i = 0; i < this.screenshotList.length; i++) {
        const newBlob = await this.cropImage(this.screenshotList[i], cropImageInfo)
        const newCropImageInfo: CropImageInfo = this.setDataInCropImageInfo(newBlob)
        this.screenshotList[i].cropImageInfos.push(newCropImageInfo);
      }
    }
  }

  // 裁剪图片
  async cropImage(data: ScreenshotInfo, cropImageInfo: ImageInfo): Promise<Blob> {
    // 必须要等到图片载入完成才行，不然可能有概率截取到全黑的图片，所以要承诺返回
    const img = await new Promise<HTMLImageElement>((resolve) => {
      const imgIn = new Image();
      imgIn.onload = () => resolve(imgIn);
      imgIn.src = data.url;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    // 设置裁剪的区域，这里只是一个示例，实际可根据需求设置
    const x = Math.floor(cropImageInfo.x); // 起始X坐标
    const y = Math.floor(cropImageInfo.y); // 起始Y坐标
    const width = Math.floor(cropImageInfo.width); // 要裁剪的宽度
    const height = Math.floor(cropImageInfo.height); // 要裁剪的高度
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

    //  console.log(canvas.toDataURL("image/jpeg"));
    const newBlob = new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 1));
    return newBlob as Promise<Blob>
  }
}
