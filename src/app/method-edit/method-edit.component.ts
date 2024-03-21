import { Component, OnInit } from '@angular/core';
import { TableHttpService } from '../core/services/https/table-http.service';
import { ProjectInfo } from '../config/config-data';
import { MenuService } from '../core/services/menus/menu.service';
import { DevUIModule, LayoutModule, LoadingService } from 'ng-devui';
import { CommonModule } from '@angular/common';
import { SubMenusComponent } from '../shared/components/sub-menus/sub-menus.component';
import { Papa, ParseResult } from 'ngx-papaparse';
import { DataTableModule, EditableTip } from 'ng-devui/data-table';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'ng-devui/input-group';
import { imageMatchMethodArgList } from '../shared/mock-data/match-mock';
import { LoadingModule } from 'ng-devui/loading';
import { ToastService } from 'ng-devui/toast';
import { defaultEncode } from '../shared/mock-data/config-mock';

@Component({
  selector: 'app-method-edit',
  standalone: true,
  templateUrl: './method-edit.component.html',
  styleUrl: './method-edit.component.scss',
  imports: [
    LayoutModule,
    CommonModule,
    SubMenusComponent,
    DataTableModule,
    FormsModule,
    DevUIModule,
    InputGroupModule,
    LoadingModule,
  ],
})
export class MethodEditComponent implements OnInit {
  currentSubMenu!: ProjectInfo;
  csvData!: string[];
  csvHeader: string[] = imageMatchMethodArgList.map(d1=>{
    return d1['参数名'];
  });
  editableTip = EditableTip.hover;
  // 按钮点击后的载入提示
  btnShowLoading = false;

  constructor(
    private tableHttp: TableHttpService,
    private menu: MenuService,
    private papa: Papa,
    private loadingService: LoadingService,
    private toastService: ToastService 
  ) {}

  ngOnInit(): void {
    // 数据载入提示
    const loadTip = this.loadingService.open();

    // 初始化时设置菜单，第一次启动和每次加载
    void this.menu
      .initCurrentSubMenu()
      .then((data) => {
        this.currentSubMenu = data;
        this.getcsvFile();
      })
      .then(() => {
        // 关闭载入提示
        loadTip.loadingInstance.close();
        // setTimeout(() => {

        // }, 2000);
      });
  }

  // 从子菜单组件中发送信息到这里，用于修改当前子菜单的信息。
  getCurrentSubMenu(currentSubMenu: ProjectInfo) {
    this.currentSubMenu = currentSubMenu;
  }
  // 从执行端获得csv文件，后续可能需要区分文件名
  getcsvFile() {
    this.tableHttp
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
            let arr = results.data;
            arr.shift();
            this.csvData = arr;
            // this.filterListMulti=arr.map((da:string[])=>{
            //   return {
            //     name:da[1],
            //     value:da[1]
            //   }
            // })
            // console.log("this.filterListMulti=",this.filterListMulti)

            //  console.log( )
            // this.filterListMulti=JSON.parse(JSON.stringify(arr))
            console.log(this.csvHeader, this.csvData);
          },
          encoding: defaultEncode,
          // header:true,
          download: true,
        };
        this.papa.parse(csv, csvParseOptions);
        // Add your options here
      });
  }

  // 过滤使用，暂时没打算添加
  // onFirstFilterChange($event: any) {
  //   console.log(
  //     '🚀 ~ MethodEditComponent ~ onFirstFilterChange ~ event:',
  //     $event
  //   );
  //   this.csvData =  this.csvData.filter((data:string)=>{
  //     return data[1]===$event[0].value
  //   })
  // }

  // 保存csv文件到执行端
  postCsv() {
    this.btnShowLoading = true;
    // let csvArr=[this.csvData.meta.fields]
    // for(let i=0;i<csvArr[0].length;++i){
    //   for(let j=0;i<this.csvData.data)
    // }
    const csvArr = [this.csvHeader].concat(this.csvData);
    const csvStr = this.papa.unparse(csvArr);

    console.log('🚀 ~ CsvEditComponent ~ putCsv ~ csvStr:', csvStr);
    const csvBlob = new Blob([csvStr], { type: 'text/csv' });

    const csvFile = new File([csvBlob], 'foo.csv', { type: 'text/csv' });
    console.log('🚀 ~ CsvEditComponent ~ putCsv ~ csvFile:', csvFile);
    this.tableHttp
      .postCsvFile(
        this.currentSubMenu.executionSideInfo.ipPort,
        this.currentSubMenu.name,
        csvFile
      )
      .subscribe((data:any) => {
        this.toastService.open({
          value: [{ severity: 'success', summary: '摘要', content: data }],
        });
      })
      .add(() => {
        this.btnShowLoading = false;
      });
  }
}
