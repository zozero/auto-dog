import { Component } from '@angular/core';

import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-image-process',
  standalone: true,
  imports: [],
  templateUrl: './image-process.component.html',
  styleUrl: './image-process.component.scss'
})
export class ImageProcessComponent {
  projectName=''
  constructor(
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(param=>{
      this.projectName=param.str
    })
  }
}
