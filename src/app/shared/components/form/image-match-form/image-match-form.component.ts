import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormLayout, FormModule } from 'ng-devui/form';
import { FormsModule } from '@angular/forms';
import { InputNumberModule, ToastService } from 'ng-devui';
import { ImageMatchMethodType } from '../../../../core/interface/table-type';
import { TranslateModule } from '@ngx-translate/core';
import { defaultImageMatchMethodArgs } from '../../../../core/mock/match-mock';
import { cloneDeep } from 'lodash';
import { ImageHttpService } from '../../../../core/services/https/image-http.service';

@Component({
  selector: 'app-image-match-form',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    FormsModule,
    InputNumberModule,
    TranslateModule,
  ],
  templateUrl: './image-match-form.component.html',
  styleUrl: './image-match-form.component.scss',
})
export class ImageMatchFormComponent implements OnInit {
  @Input() range!: string;
  // 参数对，初始一个预设的值
  args: ImageMatchMethodType = cloneDeep(defaultImageMatchMethodArgs);

  // 表单垂直布局
  vertical: FormLayout = FormLayout.Vertical;

  constructor(
    private imageHttp: ImageHttpService,
    private toastService: ToastService) {
  }
  ngOnInit(): void {
    this.args['范围'] = this.range;
    console.log('🚀 ~ InputSwitchComponent ~ currentArg:', this.args);
  }
  
}
