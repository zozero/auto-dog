import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'ng-devui/form';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'ng-devui';



@Component({
  selector: 'app-input-switch',
  standalone: true,
  imports: [CommonModule, FormModule, FormsModule, InputNumberModule],
  templateUrl: './input-switch.component.html',
  styleUrl: './input-switch.component.scss',
})
// 用户自动切换输入框组件
export class InputSwitchComponent {
  methodArgType:any;
  @Input() currentItem!: any;
  constructor() {
    
  console.log("🚀 ~ InputSwitchComponent ~ currentItem:", this.currentItem)
  }
}
