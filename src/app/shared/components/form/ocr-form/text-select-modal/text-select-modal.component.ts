import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalComponent } from 'ng-devui';
import { BadgeModule } from 'ng-devui/badge';
import { CardModule } from 'ng-devui/card';

@Component({
  selector: 'app-text-select-modal',
  standalone: true,
  imports: [
    CommonModule,
    BadgeModule,
    CardModule
  ],
  templateUrl: './text-select-modal.component.html',
  styleUrl: './text-select-modal.component.scss'
})
export class TextSelectModalComponent {
  @Input() data!: any;
  @Input() modalInstance!: ModalComponent;
  // 发送选中的数据
  @Output () emitSelectData: EventEmitter<any> = new EventEmitter();
  constructor() {}

  close(item:[]) {
    // 更新时向外部组件发送修改了。
    this.emitSelectData.emit(item);
    this.modalInstance.hide();
  }
}
