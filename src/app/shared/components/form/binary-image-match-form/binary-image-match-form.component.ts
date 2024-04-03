import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormLayout, FormModule, ImagePreviewModule, InputNumberModule } from 'ng-devui';
import { defaultBinaryImageMatchMethodArgs } from '../../../../core/mock/match-mock';
import { BinaryImageMatchMethodType } from '../../../../core/interface/table-type';
import { cloneDeep } from 'lodash-es';
import { IconModule } from 'ng-devui/icon';
import { InputGroupModule } from 'ng-devui/input-group';

@Component({
  selector: 'app-binary-image-match-form',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    FormsModule,
    InputNumberModule,
    TranslateModule,
    IconModule,
    ImagePreviewModule,
    InputGroupModule
  ],
  templateUrl: './binary-image-match-form.component.html',
  styleUrl: './binary-image-match-form.component.scss'
})
export class BinaryImageMatchFormComponent implements OnInit {
  @Input() range!: string;
  @Output() previewImage:EventEmitter<any>=new EventEmitter()
  // 参数对，初始一个预设的值
  args: BinaryImageMatchMethodType = cloneDeep(defaultBinaryImageMatchMethodArgs);

  // 表单垂直布局
  vertical: FormLayout = FormLayout.Vertical;

  constructor() {
  }
  ngOnInit(): void {
    // console.log("BinaryImageMatchFormComponent");
    this.args['范围'] = this.range;
  }

  // 打开图片
  openPreviewImage() {
   this.previewImage.emit([this.args['阈值'],this.args['阈值类型']])
  }
}
