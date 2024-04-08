import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormLayout, FormModule } from 'ng-devui/form';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'ng-devui';
import { MultiImageMatchMethodType } from '../../../../core/interface/table-type';
import { TranslateModule } from '@ngx-translate/core';
import { defaulmultitImageMatchMethodArgs } from '../../../../core/mock/match-mock';
import { cloneDeep } from 'lodash-es';
import { SelectModule } from 'ng-devui/select';

@Component({
  selector: 'app-multi-image-match-form',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    FormsModule,
    InputNumberModule,
    TranslateModule,
    SelectModule,
  ],
  templateUrl: './multi-image-match-form.component.html',
  styleUrl: './multi-image-match-form.component.scss'
})
export class MultiImageMatchFormComponent implements OnInit {
  @Input() range!: string;
  rangeList: string[] = [];
  // 参数对，初始一个预设的值
  args: MultiImageMatchMethodType = cloneDeep(defaulmultitImageMatchMethodArgs);

  // 表单垂直布局
  vertical: FormLayout = FormLayout.Vertical;

  constructor() {
  }
  ngOnInit(): void {
    this.rangeList = [
      this.range,
      this.args['范围']
    ]
  }
}
