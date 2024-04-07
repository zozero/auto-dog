import { Component, Input } from '@angular/core';
import { TabsModule } from 'ng-devui/tabs';
import { CommonModule } from '@angular/common';
import { CropImageInfo } from '../../../core/interface/image-type';
import { ImagePreviewModule } from 'ng-devui/image-preview';

@Component({
  selector: 'app-crop-tabs',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    ImagePreviewModule
  ],
  templateUrl: './crop-tabs.component.html',
  styleUrl: './crop-tabs.component.scss'
})
export class CropTabsComponent {
  @Input() cropList!:CropImageInfo [] 
  tabActiveId = 0;

  constructor(){
    console.log("cropList",this.cropList)
  }
  onAddOrDeleteTable($event: any) {
    if( $event.operation==='delete'){
      this.cropList.splice($event.id as number,1)
    }
    console.log("🚀 ~ ImageTabsComponent ~ onAddOrDeleteTable ~ operation:", $event.operation)
    console.log("🚀 ~ ImageTabsComponent ~ onAddOrDeleteTable ~ id:", $event.id)

  }
}
