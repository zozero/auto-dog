import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormLayout, SelectModule } from 'ng-devui';
import { FormModule } from 'ng-devui/form';
import { imageMethodList } from '../../mock-data/match-mock';
import { CommonModule } from '@angular/common';
import { InputSwitchComponent } from '../input-switch/input-switch.component';

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
  ],
})
export class CropImageUploadComponent implements OnInit {
  // 该数据必然在初始时就有
  @Input() data: any;
  @Input() handler!: any;

  layoutDirection: FormLayout = FormLayout.Vertical;
  selectOptions: any = imageMethodList;
  currentImageMethod = imageMethodList[0];
  inputList: any[] = imageMethodList[0]['参数列表'];

  ngOnInit(): void {
    // 如果参数列表中有J“范围”参数就直接计算范围
    this.currentImageMethod['参数列表'].map((d2) => {
      if (d2['参数名'] === '范围') {
        const baseNum = 50;
        // 四舍五入的计算
        const curX=Math.round(this.data.info.x as number-baseNum)
        const curY=Math.round(this.data.info.y as number-baseNum)
        const curWidth=Math.round(this.data.info.width as number+baseNum)
        const curHeight=Math.round(this.data.info.height as number+baseNum)
        
        d2['默认值'] =curX+' ' +curY+' ' +curWidth+' ' +curHeight;
      } else {
        return d2;
      }
    });
  }

  close($event: any) {
    this.handler($event);
  }

  changeImageMethod() {
    this.inputList = this.currentImageMethod['参数列表'];
    console.log(
      '🚀 ~ CropImageUploadComponent ~ changeImageMethod ~ this.inputList:',
      this.inputList
    );
  }
}
