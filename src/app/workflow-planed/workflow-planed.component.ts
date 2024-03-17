import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExecutionSideHttpService } from '../core/services/https/execution-side-http.service';
import { ProjectInfo } from '../config/config-data';
import { MenuService } from '../core/services/menus/menu.service';
import { LayoutModule } from 'ng-devui';
import { CommonModule } from '@angular/common';
import { SubMenusComponent } from '../shared/components/sub-menus/sub-menus.component';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-workflow-planed',
  standalone: true,
  templateUrl: './workflow-planed.component.html',
  styleUrl: './workflow-planed.component.scss',
  imports: [LayoutModule, CommonModule, SubMenusComponent],
})
export class WorkflowPlanedComponent implements OnInit {
  currentSubMenu!: ProjectInfo;
  constructor(
    private route: ActivatedRoute,
    private executionSideHttp: ExecutionSideHttpService,
    private menu: MenuService,
    private papa: Papa
  ) {

  }
  ngOnInit(): void {
    void this.menu.initCurrentSubMenu().then((data) => {
      this.currentSubMenu = data;

      this.test();
    });
  }
  getCurrentSubMenu(currentSubMenu: ProjectInfo) {
    this.currentSubMenu = currentSubMenu;
  }
  test() {
    this.executionSideHttp
      .getCsvFile(
        this.currentSubMenu.executionSideInfo.ipPort,
        this.currentSubMenu.name
      )
      .subscribe((csv) => {
        console.log('🚀 ~ WorkflowPlanedComponent ~ ).subscribe ~ csv:', csv);
        const csvParseOptions = {
          complete: (results: any, file: any) => {
            console.log('Parsed: ', results, file);
          },
          encoding:'gbk',
          header:true,
          download:true
        };
        this.papa.parse(csv, csvParseOptions);
        // Add your options here
      });
  }
}
