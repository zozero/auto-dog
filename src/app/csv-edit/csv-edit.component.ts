

import { Component, OnInit } from '@angular/core';
import { ExecutionSideHttpService } from '../core/services/https/execution-side-http.service';
import { ProjectInfo } from '../config/config-data';
import { MenuService } from '../core/services/menus/menu.service';
import { DevUIModule, LayoutModule } from 'ng-devui';
import { CommonModule } from '@angular/common';
import { SubMenusComponent } from '../shared/components/sub-menus/sub-menus.component';
import { Papa, ParseResult } from 'ngx-papaparse';
import { DataTableModule, EditableTip } from 'ng-devui/data-table';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'ng-devui/input-group';

@Component({
  selector: 'app-csv-edit',
  standalone: true,
  templateUrl: './csv-edit.component.html',
  styleUrl: './csv-edit.component.scss',
  imports: [LayoutModule, CommonModule, SubMenusComponent,DataTableModule,FormsModule,DevUIModule,InputGroupModule],
})
export class CsvEditComponent implements OnInit {
  currentSubMenu!: ProjectInfo;
  csvData!:string[];
  csvHeader!:string[]
  editableTip = EditableTip.hover;
  constructor(
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
          complete: (results: ParseResult, file: any) => {
            console.log('Parsed: ', results, file);
            // eslint-disable-next-line prefer-const
            let arr=results.data
            this.csvHeader=arr[0];
            arr.shift();
            this.csvData=arr;
            console.log( this.csvHeader,this.csvData)
          },
          encoding:'gbk',
          // header:true,
          download:true
        };
        this.papa.parse(csv, csvParseOptions);
        // Add your options here
      });
  }

  putCsv(){
    // let csvArr=[this.csvData.meta.fields]
    // for(let i=0;i<csvArr[0].length;++i){
    //   for(let j=0;i<this.csvData.data)
    // }
    const csvArr=[this.csvHeader].concat(this.csvData)
    const csvStr= this.papa.unparse(csvArr)
  
    console.log("🚀 ~ CsvEditComponent ~ putCsv ~ csvStr:", csvStr)
    const csvBlob = new Blob([csvStr], { type: 'text/csv' });
    
    const csvFile = new File([csvBlob], "foo.csv", {type: "text/csv",});
    console.log("🚀 ~ CsvEditComponent ~ putCsv ~ csvFile:", csvFile)
    this.executionSideHttp.postCsvFile( this.currentSubMenu.executionSideInfo.ipPort,
      this.currentSubMenu.name,csvFile).subscribe((data=>{
        console.log(data)
      }))
  }
}
