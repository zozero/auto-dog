import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TabsModule } from 'ng-devui/tabs';
import { ScreenshotInfo } from '../../../core/interface/image-type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-screenshot-tabs',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,],
  templateUrl: './screenshot-tabs.component.html',
  styleUrl: './screenshot-tabs.component.scss'
})
export class ScreenshotTabsComponent {
  @Input() screenshotList: ScreenshotInfo[] = []
  @Output() tabIdEmit: EventEmitter<any> = new EventEmitter();

  tabActiveId: number | string = 0;

  // 添加或者删除数据
  onAddOrDeleteTable($event: any) {
    if ($event.operation === 'delete') {
      this.screenshotList.splice($event.id as number, 1)
    }
  }

  // 图片栏活动改变后运行
  onActiveTabChange(id: number | string) {
    this.tabIdEmit.emit(id)
  }
}