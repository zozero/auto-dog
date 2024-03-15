import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'ng-devui/button';
import { LayoutModule } from 'ng-devui';
import { SelectModule } from 'ng-devui/select';
import { FormsModule } from '@angular/forms';
import { configTable } from '../core/services/dexie-db/config-table.service';
import { SubMenusComponent } from "../shared/components/sub-menus/sub-menus.component";
import { ProjectInfo } from '../config/config-data';



@Component({
    selector: 'app-image-process',
    standalone: true,
    templateUrl: './image-process.component.html',
    styleUrl: './image-process.component.scss',
    imports: [ButtonModule, LayoutModule, SelectModule, FormsModule, SubMenusComponent]
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

  async toggleLoading() {
    const configDatao= await configTable.getOneConfigData();
    console.log("🚀 ~ ImageProcessComponent ~ toggleLoading ~ configDatao:", configDatao)
    
    this.showLoading = true;
    setTimeout(() => {
      this.showLoading = false;
    }, 1000);
  }

  getCurrentSubMenu(newItem: ProjectInfo) {
    console.log("🚀 ~ ImageProcessComponent ~ addItem ~ newItem:", newItem)
    
  }
}
