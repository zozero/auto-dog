import { Component, Input } from '@angular/core';
import { methodArgType } from '../../mock-data/match-mock';
import { CommonModule } from '@angular/common';
import { FormModule } from 'ng-devui/form';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'ng-devui';

export interface InputSwitchItem {
  参数名: string;
  默认值: any;
}

@Component({
  selector: 'app-input-switch',
  standalone: true,
  imports: [CommonModule, FormModule, FormsModule, InputNumberModule],
  templateUrl: './input-switch.component.html',
  styleUrl: './input-switch.component.scss',
})
// 用户自动切换输入框组件
export class InputSwitchComponent {
  methodArgType = methodArgType;
  @Input() currentItem!: InputSwitchItem;
  constructor() {}
}
