import { Component, Input, OnInit } from '@angular/core';
import { DataTableModule, EditableTip } from 'ng-devui/data-table';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'ng-devui/input-group';
import { DevUIModule, ToastService } from 'ng-devui';
import { TableHttpService } from '../../../core/services/https/table-http.service';
import { matchMethodList } from '../../../core/mock/match-mock';
import { Papa, ParseResult } from 'ngx-papaparse';
import { CommonModule } from '@angular/common';
import { cloneDeep } from 'lodash';
import { ProjectInfo } from '../../../core/interface/config-type';
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
        CommonModule
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
  constructor(
    private papa: Papa, 
    private tableHttp: TableHttpService,
    private toastService:ToastService
    ) {}
  ngOnInit(): void {
    console.log("imageMatch",this.imageMatch)
    this.getcsvFile();
    
  }
  
  // 从执行端获得csv文件，后续可能需要区分文件名
  getcsvFile() {
    this.tableHttp
      .getCsvFile(
        this.projectInfo.executionSideInfo?.ipPort as string,
        this.projectInfo.name,
        this.imageMatch['名称']
      )
      .subscribe((csv) => {
        const csvParseOptions = {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          complete: (results: ParseResult, file: any) => {
            // console.log('Parsed: ', results, file);
            // eslint-disable-next-line prefer-const
            let arr = results.data;
            this.csvHeader=arr[0]
            // 丢掉第一行数据
            arr.shift();
            this.csvData = arr;
            // 删除掉最后一行的空数据
            this.csvData.pop()
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
  
  // 保存csv文件到执行端，这里直接覆盖了
  putCsvFile () {
    // eslint-disable-next-line prefer-const
    let csvArr = [this.csvHeader].concat(this.csvData);
    // 这里必须要加空一行必然可能导致执行的pandas无法正常加数据
    csvArr.push([''])
    const csvStr = this.papa.unparse(csvArr);

    const csvBlob = new Blob([ csvStr], { type: 'text/csv'});

    const csvFile = new File([csvBlob], 'foo.csv', { type: 'text/csv' });
    console.log('🚀 ~ CsvEditComponent ~ putCsv ~ csvFile:', csvFile);
    this.tableHttp
      .putCsvFile(
        this.projectInfo.executionSideInfo?.ipPort as string,
        this.projectInfo.name,
        this.imageMatch['名称'],
        csvFile
      )
      .subscribe((data:any) => {
        this.toastService.open({
          value: [{ severity: 'success', summary: '摘要', content: data }],
        });
      })
      return true
  }
}
