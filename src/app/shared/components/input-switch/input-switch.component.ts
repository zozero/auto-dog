import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'ng-devui/form';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'ng-devui';
import { ImageArgType } from '../../../core/interface/table-type';
import { defaultmethodArgList } from '../../../core/mock/match-mock';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-input-switch',
  standalone: true,
  imports: [CommonModule, FormModule, FormsModule, InputNumberModule],
  templateUrl: './input-switch.component.html',
  styleUrl: './input-switch.component.scss',
})
// 用户自动切换输入框组件
export class InputSwitchComponent {
  // 一个预先写入所有参数类型的列表
  methodArgList: ImageArgType[] = defaultmethodArgList;
  // 使用的是数据双向绑定
  @Input() argName!: string;
  @Input() argValue!: string  | number;

  constructor() {
    console.log('🚀 ~ InputSwitchComponent ~ currentArg:', this.argName);
    // console.log("Object.keys(this.currentArg)",Object.keys(this.currentArg))
  }
}
