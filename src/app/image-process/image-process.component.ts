import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'ng-devui/button';
import { LayoutModule } from 'ng-devui';
import { SelectModule } from 'ng-devui/select';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-image-process',
  standalone: true,
  imports: [ButtonModule,LayoutModule,SelectModule,FormsModule],
  templateUrl: './image-process.component.html',
  styleUrl: './image-process.component.scss',
})
export class ImageProcessComponent {
 

  showLoading = false;
  projectName = '';

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((param) => {
      this.projectName = param.str;
    });
    this.route.url.subscribe((url:any) => {
      console.log("🚀 ~ ImageProcessComponent ~ this.route.url.subscribe ~ url:", url)
    })
  }

  toggleLoading() {
    // await configTable
    this.showLoading = true;
    setTimeout(() => {
      this.showLoading = false;
    }, 1000);
  }
}
