import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormLayout, FormModule, ImagePreviewModule, InputNumberModule } from 'ng-devui';
import { defaultNoImageMatchMethodArgs } from '../../../../core/mock/match-mock';
import { NoImageMatchMethodType } from '../../../../core/interface/table-type';
import { cloneDeep } from 'lodash-es';
import { IconModule } from 'ng-devui/icon';
import { InputGroupModule } from 'ng-devui/input-group';

@Component({
  selector: 'app-no-image-match-form',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    FormsModule,
    InputNumberModule,
    TranslateModule,
    IconModule,
    ImagePreviewModule,
    InputGroupModule],
  templateUrl: './no-image-match-form.component.html',
  styleUrl: './no-image-match-form.component.scss'
})
export class NoImageMatchFormComponent  implements OnInit {
  @Input() coordinate!:number[];
  
  // 参数对，初始一个预设的值
  args: NoImageMatchMethodType = cloneDeep(defaultNoImageMatchMethodArgs);

  // 表单垂直布局
  vertical: FormLayout = FormLayout.Vertical;

  constructor() {
  }
  ngOnInit(): void {
    // console.log("NoImageMatchFormComponent");
    this.args['X轴'] = this.coordinate[0];
    this.args['Y轴'] = this.coordinate[1];
  }


}
