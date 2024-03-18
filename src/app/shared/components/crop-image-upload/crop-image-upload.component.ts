import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormLayout, SelectModule } from 'ng-devui';
import { FormModule } from 'ng-devui/form';
import { imageMethodList } from '../../mock-data/match-mock';
import { CommonModule } from '@angular/common';
import { InputSwitchComponent } from '../input-switch/input-switch.component';
import { ButtonModule } from 'ng-devui/button';
import {cloneDeep} from 'lodash'

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
  selectOptions: any = imageMethodList;
  // 此处最好深度拷贝，不然默认值将被修改。
  currentImageMethod: any = cloneDeep(imageMethodList[0]);
  inputList: any[] = this.currentImageMethod['参数列表'];

  ngOnInit(): void {
    this.imageData = this.data.imageData;
    this.setCurrentImageMethodData();
  }

  close() {
    console.log(
      '🚀 ~ CropImageUploadComponent ~ close ~ this.inputList:',
      this.inputList
    );
    console.log("imageData",this.data)
    this.data.close();
  }
  // 设置当前输入列表的数据，每一次点击截取的时候都需要重新计算一遍
  setCurrentImageMethodData() {
    // 如果参数列表中有J“范围”参数就直接计算范围
    this.currentImageMethod['参数列表'].map((d2:any) => {
      if (d2['参数名'] === '范围') {
        const baseNum = 50;
        // 四舍五入的计算
        const curX = Math.round((this.imageData.info.x as number) - baseNum);
        const curY = Math.round((this.imageData.info.y as number) - baseNum);
        const curWidth = Math.round(
          (this.imageData.info.width as number) + baseNum
        );
        const curHeight = Math.round(
          (this.imageData.info.height as number) + baseNum
        );

        d2['默认值'] = curX + ' ' + curY + ' ' + curWidth + ' ' + curHeight;
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
