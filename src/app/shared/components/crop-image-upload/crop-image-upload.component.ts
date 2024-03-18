import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-crop-image-upload',
  standalone: true,
  imports: [],
  templateUrl: './crop-image-upload.component.html',
  styleUrl: './crop-image-upload.component.scss'
})
export class CropImageUploadComponent {
  @Input() data: any;
  @Input() handler!: any;

  close($event: any) {
    this.handler($event);
  }
}
