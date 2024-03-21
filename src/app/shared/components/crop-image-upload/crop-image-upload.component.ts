import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormLayout, SelectModule, ToastService } from 'ng-devui';
import { FormModule } from 'ng-devui/form';
import {
  matchMethodList,
} from '../../../core/mock/match-mock';
import { CommonModule } from '@angular/common';
import { InputSwitchComponent } from '../input-switch/input-switch.component';
import { ButtonModule } from 'ng-devui/button';
import { cloneDeep } from 'lodash';
import { ImageHttpService } from '../../../core/services/https/image-http.service';
import {
  matchMethodType,
} from '../../../core/interface/table-type';
import { CropImageInfo } from '../../../core/interface/image-type';
import {
  ExecutionSideInfo,
  ProjectInfo,
} from '../../../core/interface/config-type';

@Component({
  selector: 'app-crop-image-upload',
  standalone: true,
  templateUrl: './crop-image-upload.component.html',
  styleUrl: './crop-image-upload.component.scss',
  imports: [
    FormModule,
    FormsModule,
    SelectModule,
    CommonModule,
    InputSwitchComponent,
    ButtonModule,
  ],
})
export class CropImageUploadComponent implements OnInit {
  @Input() data: any;
  // 裁剪的图片信息
  imageData!: CropImageInfo;
  // 项目信息
  projectInfo!: ProjectInfo;
  // 用于关闭弹出宽
  closeDialog!: () => void;

  // 页面显示参数
  layoutDirection: FormLayout = FormLayout.Vertical;

  matchMethodList: matchMethodType[] = cloneDeep(matchMethodList);
  // 此处最好深度拷贝，不然默认值将被修改。
  currentImageMethod: matchMethodType = this.matchMethodList[0];
  // 图片csv表格中的参数
  // imageArgs: ImageMatchMethodType = this.currentImageMethod['参数'];

  constructor(
    private imageHttp: ImageHttpService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // 传过了的参数立即赋值
    this.imageData = this.data.imageData;
    this.projectInfo = this.data.projectInfo;
    this.closeDialog = this.data.close;

    this.setCurrentImageMethodData();
  }

  submit() {
    const imageFile = new File(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      [this.data.imageData.imageBlob],
      this.currentImageMethod['参数']['图片名'] + '.jpg',
      { type: 'image/jpg' }
    );

    // 上传图片
    const tmpInfo = this.projectInfo.executionSideInfo as ExecutionSideInfo;
    this.imageHttp
      .postImageMethodUploadImage(
        imageFile,
        tmpInfo.ipPort,
        this.projectInfo.name
      )
      .subscribe((data: any) => {
        this.toastService.open({
          value: [{ severity: 'success', summary: '摘要', content: data }],
        });
      })
      .add(() => {
        this.data.close();
      });

    // 向csv表格中添加数据
    this.imageHttp
      .postImageMethodAddData(
        this.currentImageMethod['参数'],
        tmpInfo.ipPort,
        this.projectInfo.name
      )
      .subscribe((data: any) => {
        this.toastService.open({
          value: [{ severity: 'success', summary: '摘要', content: data }],
        });
      })
      .add(() => {
        this.data.close();
      });
  }

  // 设置当前输入列表的数据，每一次点击截取的时候都需要重新计算一遍
  setCurrentImageMethodData() {
    // 如果参数列表中有J“范围”参数就直接计算范围
    // 范围是左上和右下的坐标
    const baseNum = 50;
    // 四舍五入的计算
    // 不要超出屏幕的范围
    let x1 = Math.round(this.imageData.info.x - baseNum);
    if (x1 < 0) {
      x1 = 0;
    }
    let y1 = Math.round(this.imageData.info.y - baseNum);
    if (y1 < 0) {
      y1 = 0;
    }
    let x2 = x1 + Math.round(this.imageData.info.width + baseNum);
    if (x2 > this.imageData.rowImageInfo.width) {
      x2 = this.imageData.rowImageInfo.width;
    }
    let y2 = y1 + Math.round(this.imageData.info.height + baseNum);
    if (y2 > this.imageData.rowImageInfo.height) {
      y2 = this.imageData.rowImageInfo.height;
    }

    this.currentImageMethod['参数']['范围'] = x1 + ' ' + y1 + ' ' + x2 + ' ' + y2;
  }

  changeImageMethod() {
    // this.inputList = this.currentImageMethod['参数列表'];
    // console.log(
    //   '🚀 ~ CropImageUploadComponent ~ changeImageMethod ~ this.inputList:',
    //   this.inputList
    // );
  }
}
