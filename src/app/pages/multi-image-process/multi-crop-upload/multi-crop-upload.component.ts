import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ProjectInfo } from '../../../core/interface/config-type';
import { CropImageInfo, ScreenshotInfo } from '../../../core/interface/image-type';
import { CommonModule } from '@angular/common';
import { GalleryModule, GalleryItem, ImageItem, GalleryComponent } from 'ng-gallery';
import { ButtonModule, DialogService, FormLayout, FormModule, SelectModule, ToastService } from 'ng-devui';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatchMethodType, MultiImageMatchMethodType } from '../../../core/interface/table-type';
import { cloneDeep } from 'lodash-es';
import { multiImageMatchMethodList } from '../../../core/mock/match-mock';
import { MultiImageMatchFormComponent } from "../../../shared/components/form/multi-image-match-form/multi-image-match-form.component";
import { AddStepInImageDialogComponent } from '../../image-process/add-step-in-image-dialog/add-step-in-image-dialog.component';
import { TableHttpService } from '../../../core/services/https/table-http.service';
import { ImageHttpService } from '../../../core/services/https/image-http.service';
import { TipsDialogService } from '../../../core/services/tips-dialog/tips-dialog.service';

@Component({
  selector: 'app-multi-crop-upload',
  standalone: true,
  templateUrl: './multi-crop-upload.component.html',
  styleUrl: './multi-crop-upload.component.scss',
  imports: [
    CommonModule,
    GalleryModule,
    FormModule,
    FormsModule,
    SelectModule,
    ButtonModule,
    TranslateModule,
    MultiImageMatchFormComponent,
  ]
})
export class MultiCropUploadComponent implements OnInit {
  @Input() data: any;
  // 图片匹配的表单视图
  @ViewChild('multiImageMatchForm') public multiImageMatchForm!: MultiImageMatchFormComponent;
  @ViewChild(GalleryComponent) gallery!: GalleryComponent;
  // 用于获取当前匹配方法的参数
  currentArgs!: MultiImageMatchMethodType;

  // 裁剪的图片信息
  screenshotList!: ScreenshotInfo[];
  // 当前图片列表
  currentImageList: GalleryItem[] = [];
  // 当前图片Blob列表
  currentImageBlobList: Blob[] = [];
  // 项目信息
  projectInfo!: ProjectInfo;
  // 用于关闭弹出宽
  closeDialog!: () => void;
  // 用于选择方法类型，从而使用不同表单
  matchMethodList: MatchMethodType[] = cloneDeep(multiImageMatchMethodList);
  // 当前图片匹配方法
  currentMethod: MatchMethodType = this.matchMethodList[0]
  // 页面显示参数
  layoutDirection: FormLayout = FormLayout.Vertical;
  // 发送给匹配方法表单的范围
  range: string = '';

  constructor(
    private tableHttp: TableHttpService,
    private imageHttp: ImageHttpService,
    private toastService: ToastService,
    private tipsService: TipsDialogService,
    private dialogService: DialogService,
    private cdRef: ChangeDetectorRef
  ) {

  }
  ngOnInit(): void {
    // 传过了的参数立即赋值
    this.screenshotList = this.data.screenshotList;
    this.projectInfo = this.data.projectInfo;
    this.closeDialog = this.data.close;

    this.setCurrentImageList(this.currentMethod['名称']);
  }
  // 设置当前图片列表
  setCurrentImageList(name: string) {
    this.currentImageList = []
    let tipTrigger = 0;
    if (name === '你只看一次') {
      this.screenshotList.forEach((data: ScreenshotInfo) => {
        this.currentImageList.push(
          new ImageItem({ src: data.url, thumb: data.url })
        )
        this.currentImageBlobList.push(data.blob)

        if (data.cropImageInfos.length > 0) {
          tipTrigger++
        }
      })
    } else if (name === '多图匹配') {
      // 多图匹配只需要截图
      this.screenshotList.forEach((data: ScreenshotInfo) => {
        data.cropImageInfos.forEach((data2: CropImageInfo) => {
          this.currentImageList.push(
            new ImageItem({ src: data2.url, thumb: data2.url })
          );
          this.currentImageBlobList.push(data2.blob);
          tipTrigger++;
        })
      })
      // 设置范围
      this.setCurrentImageRange();
    }

    // 如果没有截图
    if (tipTrigger === 0) {
      this.tipsService.openErrorDialog('你似乎忘记截图了。');
      // 关闭对话框
      this.closeDialog();
    }
  }

  // 设置多图匹配的范围，每一次点击截取的时候都需要重新计算一遍
  setCurrentImageRange() {
    if (this.screenshotList.length > 0 && this.screenshotList[0].cropImageInfos !== undefined && this.screenshotList[0].cropImageInfos.length > 0) {
      // 如果参数列表中有“范围”参数就直接计算范围
      // 范围是左上和右下的坐标
      const baseNum = 100;
      // 四舍五入的计算
      // 不要超出屏幕的范围
      let x1 = Math.round(this.screenshotList[0].cropImageInfos[0].info.x - baseNum);
      if (x1 < 0) {
        x1 = 0;
      }
      let y1 = Math.round(this.screenshotList[0].cropImageInfos[0].info.y - baseNum);
      if (y1 < 0) {
        y1 = 0;
      }
      let x2 = x1 + Math.round(this.screenshotList[0].cropImageInfos[0].info.width + baseNum);
      if (x2 > this.screenshotList[0].cropImageInfos[0].rowImageInfo.width) {
        x2 = this.screenshotList[0].cropImageInfos[0].rowImageInfo.width;
      }
      let y2 = y1 + Math.round(this.screenshotList[0].cropImageInfos[0].info.height + baseNum);
      if (y2 > this.screenshotList[0].cropImageInfos[0].rowImageInfo.height) {
        y2 = this.screenshotList[0].cropImageInfos[0].rowImageInfo.height;
      }

      this.range =
        x1 + ' ' + y1 + ' ' + x2 + ' ' + y2;
    }
  }

  // 提交到服务器
  submit() {
    switch (this.currentMethod['名称']) {
      case '多图匹配': {
        this.currentArgs = this.multiImageMatchForm.args;
        this.currentArgs['数量'] = this.currentImageList.length

        this.uploadImage();
        this.addCsvData();
        break
      }
      case '你只看一次': {
        // this.currentArgs = this.noImageMatchForm.args;

        // this.uploadImage();
        // this.addCsvData();
        break
      }
    }
  }


  // 上传图片
  uploadImage() {
    const imageFileList = []
    for (let i = 0; i < this.currentImageBlobList.length; i++) {
      imageFileList.push(
        new File(
          [this.currentImageBlobList[i]],
          this.currentArgs['图片名'] + '-' + (i + 1) + '.jpg',
          { type: 'image/jpeg' }
        ))
    }

    // 上传图片
    this.imageHttp
      .postUploadMultiImage(
        this.projectInfo.executionSideInfo?.ipPort as string,
        this.projectInfo.name,
        imageFileList
      )
      .subscribe({
        next: (data: any) => {
          this.toastService.open({
            value: [{ severity: 'success', summary: '摘要', content: data }],
          })
        },
        error: (err: any) => {
          this.tipsService.responseErrorState(err.status as number)
          // 关闭对话框
          this.closeDialog();
        },
        complete: () => {
          // 关闭对话框
          this.closeDialog();
        }
      });
  }
  // 向csv表格中添加数据
  addCsvData() {
    this.tableHttp
      .postMethodAddData(
        this.projectInfo.executionSideInfo?.ipPort as string,
        this.projectInfo.name,
        this.currentMethod['名称'],
        this.currentArgs
      )
      .subscribe({
        next: (data: any) => {
          this.toastService.open({
            value: [{ severity: 'success', summary: '摘要', content: data }],
          })
          // 打开添加步骤的弹出框
          this.addStepDialog();
        },
        error: (err: any) => {
          this.tipsService.responseErrorState(err.status as number)
          // 关闭载入效果
          this.data.close();
        },
        complete: () => {
          // 关闭载入效果
          this.data.close();
        }
      })
  }

  // 打开添加步骤的弹出框
  addStepDialog() {
    const config = {
      id: 'add-step-in-image-dialog',
      maxWidth: '900px',
      maxHeight: '600px',
      title: '快捷添加步骤',
      content: AddStepInImageDialogComponent,
      backdropCloseable: true,
      // onClose: () => // console.log('on dialog closed'),
    };

    const addStepDialog = this.dialogService.open({
      ...config,
      showMaximizeBtn: true,
      dialogtype: 'standard',
      showAnimation: false,
      data: {
        projectInfo: this.projectInfo,
        methodInfo: this.currentMethod,
        imageName: this.currentArgs['图片名'],
        close: () => {
          addStepDialog.modalInstance.hide();
        },
      },
      buttons: [
      ],
    });
  }
  // 下拉选择框改变时执行
  onSelectValueChange($event: MatchMethodType) {
    this.setCurrentImageList($event['名称']);
    // this.gallery.load(this.currentImageList);
    this.gallery.set(0);
  }
}
