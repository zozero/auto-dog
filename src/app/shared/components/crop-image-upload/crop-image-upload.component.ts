import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormLayout, SelectModule, ToastService } from 'ng-devui';
import { FormModule } from 'ng-devui/form';
import { matchMethodList } from '../../mock-data/match-mock';
import { CommonModule } from '@angular/common';
import { InputSwitchComponent } from '../input-switch/input-switch.component';
import { ButtonModule } from 'ng-devui/button';
import { cloneDeep } from 'lodash';
import { ImageHttpService } from '../../../core/services/https/image-http.service';
import { ImageMatchMethodArgs } from '../../../core/services/https/http-data-type';

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
  // 该数据必然在初始时就有
  @Input() data: any;
  imageData: any;

  layoutDirection: FormLayout = FormLayout.Vertical;
  selectOptions: any = matchMethodList;
  // 此处最好深度拷贝，不然默认值将被修改。
  currentImageMethod: any = cloneDeep(matchMethodList[0]);
  inputList: any[] = this.currentImageMethod['参数列表'];

  constructor(
    private imageHttp: ImageHttpService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.imageData = this.data.imageData;
    this.setCurrentImageMethodData();
  }

  submit() {
    const imageArgs: ImageMatchMethodArgs = {
      图片名: this.inputList[1].默认值,
      范围: this.inputList[2].默认值,
      算法: this.inputList[3].默认值,
      最低相似度: this.inputList[4].默认值,
      额外补充: this.inputList[5].默认值,
    };
    console.log(
      '🚀 ~ CropImageUploadComponent ~ submit ~  this.data.imageData.imageBlob:',
      this.data.imageData.imageBlob
    );
    const imageFile = new File(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      [this.data.imageData.imageBlob],
      imageArgs.图片名 + '.jpg',
      { type: 'image/jpg' }
    );
    // 上传图片
    this.imageHttp
      .postImageMethodUploadImage(
        imageFile,
        this.imageData.currentMenu.executionSideInfo.ipPort as string,
        this.imageData.currentMenu.name as string
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
        imageArgs,
        this.imageData.currentMenu.executionSideInfo.ipPort as string,
        this.imageData.currentMenu.name as string
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
    this.currentImageMethod['参数列表'].map((d2: any) => {
      // 范围是左上和右下的坐标
      if (d2['参数名'] === '范围') {
        const baseNum = 50;
        // 四舍五入的计算
        // 不要超出屏幕的范围
        let x1 = Math.round((this.imageData.info.x as number) - baseNum);
        if (x1 < 0) {
          x1 = 0;
        }
        let y1 = Math.round((this.imageData.info.y as number) - baseNum);
        if (y1 < 0) {
          y1 = 0;
        }
        let x2 =
          x1 + Math.round((this.imageData.info.width as number) + baseNum);
        if (x2 > this.imageData.rowImageInfo.width) {
          x2 = this.imageData.rowImageInfo.width;
        }
        let y2 =
          y1 + Math.round((this.imageData.info.height as number) + baseNum);
        if (y2 > this.imageData.rowImageInfo.height) {
          y2 = this.imageData.rowImageInfo.height;
        }
        d2['默认值'] = x1 + ' ' + y1 + ' ' + x2 + ' ' + y2;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return d2;
      }
    });
  }

  changeImageMethod() {
    this.inputList = this.currentImageMethod['参数列表'];
    console.log(
      '🚀 ~ CropImageUploadComponent ~ changeImageMethod ~ this.inputList:',
      this.inputList
    );
  }
}
