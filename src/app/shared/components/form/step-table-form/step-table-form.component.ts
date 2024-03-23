import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormLayout, FormModule } from 'ng-devui/form';
import { FormsModule } from '@angular/forms';
import { InputNumberModule, ToastService } from 'ng-devui';
import { ImageMatchMethodType, StepTableType } from '../../../../core/interface/table-type';
import { TranslateModule } from '@ngx-translate/core';
import { defaultImageMatchMethodArgs } from '../../../../core/mock/match-mock';
import { cloneDeep } from 'lodash';
import { ImageHttpService } from '../../../../core/services/https/image-http.service';
import { TableHttpService } from '../../../../core/services/https/table-http.service';
import { defaultStepData } from '../../../../core/mock/step-mock';

@Component({
  selector: 'app-step-table-form',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    FormsModule,
    InputNumberModule,
    TranslateModule,],
  templateUrl: './step-table-form.component.html',
  styleUrl: './step-table-form.component.scss'
})
export class StepTableFormComponent implements OnInit{
  // 参数对，初始一个预设的值
  args: StepTableType = cloneDeep(defaultStepData);

  // 表单垂直布局
  vertical: FormLayout = FormLayout.Vertical;

  constructor(
    private tableHttp: TableHttpService,
    private toastService: ToastService) {
  }
  ngOnInit(): void {
    
  }
}
