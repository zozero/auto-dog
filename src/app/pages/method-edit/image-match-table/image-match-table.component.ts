import { Component, Input, OnInit } from '@angular/core';
import { DataTableModule, EditableTip } from 'ng-devui/data-table';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'ng-devui/input-group';
import { DevUIModule } from 'ng-devui';
import { TableHttpService } from '../../../core/services/https/table-http.service';
import { matchMethodList } from '../../../core/mock/match-mock';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Papa, ParseResult } from 'ngx-papaparse';
import { CommonModule } from '@angular/common';
import { InputSwitchComponent } from "../../../shared/components/input-switch/input-switch.component";
import { cloneDeep } from 'lodash';
import { ExecutionSideInfo, ProjectInfo } from '../../../core/interface/config-type';
import { defaultEncode } from '../../../core/mock/app-mock';
import { MatchMethodType } from '../../../core/interface/table-type';

@Component({
    selector: 'app-image-match-table',
    standalone: true,
    templateUrl: './image-match-table.component.html',
    styleUrl: './image-match-table.component.scss',
    imports: [
        DataTableModule,
        FormsModule,
        InputGroupModule,
        DevUIModule,
        CommonModule,
        InputSwitchComponent
    ]
})
export class ImageMatchTableComponent implements OnInit {
  csvData!: string[];
  imageMatch:MatchMethodType = cloneDeep(matchMethodList[0]);
  csvHeader!:string[];
  // 生成新的匹配方法组件命令
  // ng g c method-edit/method-table/imagwMatchTable
  // 它就是子菜单
  @Input() projectInfo!: ProjectInfo;
  editableTip = EditableTip.hover;
  constructor(private papa: Papa, private tableHttp: TableHttpService) {}
  ngOnInit(): void {
    console.log("imageMatch",this.imageMatch)
    this.getcsvFile();
    
  }
  test2(){
   
    console.log(this.csvData)
  }
  // 从执行端获得csv文件，后续可能需要区分文件名
  getcsvFile() {
    const tmpInfo=this.projectInfo.executionSideInfo as ExecutionSideInfo
    this.tableHttp
      .getCsvFile(
        tmpInfo.ipPort,
        this.projectInfo.name,
        this.imageMatch['名称']
      )
      .subscribe((csv) => {
        console.log('🚀 ~ WorkflowPlanedComponent ~ ).subscribe ~ csv:', csv);
        const csvParseOptions = {
          complete: (results: ParseResult, file: any) => {
            console.log('Parsed: ', results, file);
            // eslint-disable-next-line prefer-const
            let arr = results.data;
            this.csvHeader=arr[0]
            console.log("🚀 ~ ImageMatchTableComponent ~ .subscribe ~ this.csvHeader:", this.csvHeader)
            // 丢掉第一行数据
            arr.shift();
            this.csvData = arr;
            console.log("🚀 ~ ImageMatchTableComponent ~ .subscribe ~ this.csvData:", this.csvData)
            // this.filterListMulti=JSON.parse(JSON.stringify(arr))
          },
          encoding: defaultEncode,
          // header:true,
          download: true,
        };
        this.papa.parse(csv, csvParseOptions);
        // Add your options here
      });
  }

  // 保存csv文件到执行端
  //  postCsv() {
  //   this.btnShowLoading = true;
  //   // let csvArr=[this.csvData.meta.fields]
  //   // for(let i=0;i<csvArr[0].length;++i){
  //   //   for(let j=0;i<this.csvData.data)
  //   // }
  //   const csvArr = [this.csvHeader].concat(this.csvData);
  //   const csvStr = this.papa.unparse(csvArr);

  //   console.log('🚀 ~ CsvEditComponent ~ putCsv ~ csvStr:', csvStr);
  //   const csvBlob = new Blob([csvStr], { type: 'text/csv' });

  //   const csvFile = new File([csvBlob], 'foo.csv', { type: 'text/csv' });
  //   console.log('🚀 ~ CsvEditComponent ~ putCsv ~ csvFile:', csvFile);
  //   this.tableHttp
  //     .postCsvFile(
  //       this.currentSubMenu.executionSideInfo.ipPort,
  //       this.currentSubMenu.name,
  //       csvFile
  //     )
  //     .subscribe((data:any) => {
  //       this.toastService.open({
  //         value: [{ severity: 'success', summary: '摘要', content: data }],
  //       });
  //     })
  //     .add(() => {
  //       this.btnShowLoading = false;
  //     });
  // }
}
