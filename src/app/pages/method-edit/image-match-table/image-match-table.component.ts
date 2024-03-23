import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DataTableModule, EditableTip, FilterConfig, SortDirection, SortEventArg } from 'ng-devui/data-table';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'ng-devui/input-group';
import { DevUIModule, LoadingService, LoadingType, ToastService } from 'ng-devui';
import { TableHttpService } from '../../../core/services/https/table-http.service';
import { matchMethodList } from '../../../core/mock/match-mock';
import { Papa, ParseResult } from 'ngx-papaparse';
import { CommonModule } from '@angular/common';
import { cloneDeep, filter, orderBy } from 'lodash';
import { ProjectInfo } from '../../../core/interface/config-type';
import { defaultEncode } from '../../../core/mock/app-mock';
import { MatchMethodType } from '../../../core/interface/table-type';
import { ModalModule } from 'ng-devui/modal';
import { TipsDialogService } from '../../../core/services/tips-dialog/tips-dialog.service';

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
    ModalModule
  ]
})
export class ImageMatchTableComponent implements OnInit, OnChanges {
  csvData: string[] = [];
  // 专用于过滤的csv列表
  csvFilterList: string[] = [];
  imageMatch: MatchMethodType = cloneDeep(matchMethodList[0]);
  csvHeader!: string[];
  // 序号筛选列表
  ordinalFilterList: FilterConfig[] = []
  // 图片名刷选列表
  imgNameFilterList: FilterConfig[] = []
  // 数据的载入提示
  loadingTip!: LoadingType;
  // 生成新的匹配方法组件命令
  // ng g c method-edit/method-table/imagwMatchTable
  // 它就是子菜单
  @Input() projectInfo!: ProjectInfo;
  editableTip = EditableTip.hover;
  constructor(
    private papa: Papa,
    private tableHttp: TableHttpService,
    private toastService: ToastService,
    private dialogService: TipsDialogService,
    private loadingService: LoadingService,
    
  ) { }
  ngOnInit(): void {
    // this.getcsvFile();
    console.log("ImageMatchTableComponent");
  }
  ngOnChanges(changes: SimpleChanges) {
    if ('projectInfo' in changes) {
      this.getcsvFile();
    }

  }
  // 从执行端获得csv文件，后续可能需要区分文件名
  getcsvFile() {
    // 数据载入提示
    const loadTip = this.loadingService.open();
    this.tableHttp.getCsvFile(
        this.projectInfo.executionSideInfo?.ipPort as string,
        this.projectInfo.name,
        this.imageMatch['名称']
      )
      .subscribe({
        next: (csv) => {
          
          const csvParseOptions = {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            complete: (results: ParseResult, _file: any) => {
              // console.log('Parsed: ', results, file);
              // eslint-disable-next-line prefer-const
              let arr = results.data;
              this.csvHeader = arr[0]
              // 丢掉第一行数据
              arr.shift();
              this.csvData = arr;
              // 删除掉最后一行的空数据
              this.csvData.pop();
              this.csvFilterList = this.csvData;
              // 设置筛选数据
              this.setOrdinalFilterList();
              this.setImgNameFilterList();
              // this.filterListMulti=JSON.parse(JSON.stringify(arr))
            },
            encoding: defaultEncode,
            // header:true,
            download: true,
          };
          this.papa.parse(csv, csvParseOptions);
          // Add your options here
        },
        error: (err: any) => {
          this.csvData = []
          this.csvFilterList = [];
          this.ordinalFilterList = []
          this.imgNameFilterList = []

          // console.log("err", err);
          // 状态为零可能是服务器没开
          if (err.status != 0) {
            const csvParseOptions = {
              complete: (results: ParseResult) => {
                const tmp: string = JSON.parse(results.data[0] as string)['detail']
                this.dialogService.openErrorDialog(tmp)
              },
              encoding: 'utf8',
            }
            this.papa.parse(err.error as Blob, csvParseOptions);
          }
          else {
            this.dialogService.openErrorDialog('可能没有开启服务器。')
          }
          // 关闭载入提示
          loadTip.loadingInstance.close();
        },
        complete: () => {
          // 关闭载入提示
          loadTip.loadingInstance.close();
        }
      });
  }

 
  // 设置序号筛选列表
  setOrdinalFilterList() {
    // 初始化为空
    this.ordinalFilterList = []
    // 设置数据
    this.csvData.forEach((data) => {
      this.ordinalFilterList.push({
        name: data[0],
        value: data[0],
      })
    })

  }
  // 设置图片名的筛选列表
  setImgNameFilterList() {
    // 初始化为空
    this.imgNameFilterList = []
    // 设置数据
    this.csvData.forEach((data) => {
      this.imgNameFilterList.push({
        name: data[1],
        value: data[1],
      })
    })
  }

  // 保存csv文件到执行端，这里直接覆盖了
  putCsvFile() {
    // 准备数据
    // eslint-disable-next-line prefer-const
    let csvArr = [this.csvHeader].concat(this.csvData);
    // 这里必须要加空一行必然可能导致执行的pandas无法正常加数据
    csvArr.push([''])
    const csvStr = this.papa.unparse(csvArr);
    const csvBlob = new Blob([csvStr], { type: 'text/csv' });
    const csvFile = new File([csvBlob], 'foo.csv', { type: 'text/csv' });
    
    // 数据载入提示
    const loadTip = this.loadingService.open();
    // 发送请求
    this.tableHttp
      .putCsvFile(
        this.projectInfo.executionSideInfo?.ipPort as string,
        this.projectInfo.name,
        this.imageMatch['名称'],
        csvFile
      )
      .subscribe(
        {
          next:(data: any) => {
            this.toastService.open({
              value: [{ severity: 'success', summary: '摘要', content: data }],
            })
          },
          error: (err: any) => {
            if (err.status != 0) {
              this.dialogService.openErrorDialog('未知原因错误')

            }else{
              this.dialogService.openErrorDialog('可能没有开启服务器。')
            }
            // 关闭载入提示
            loadTip.loadingInstance.close();
          },
          complete: () => {
            // 关闭载入提示
            loadTip.loadingInstance.close();
          }
        }
      );
    return true
  }

  // 排序方式改变
  onSortChange(event: SortEventArg, field: number) {
    if (event.direction === SortDirection.ASC) {
      // 转成数字才能按照数字排序
      this.csvFilterList = orderBy(this.csvFilterList, [(data) => parseInt(data[field])], ['asc'])

    } else if (event.direction === SortDirection.DESC) {
      this.csvFilterList = orderBy(this.csvFilterList, [(data) => parseInt(data[field])], ['desc'])

    }
    else {
      this.csvFilterList = this.csvData
    }
  }

  // 多选过滤改变
  filterChangeMutil($event: FilterConfig[], key: number) {
    if ($event.length === this.csvData.length) {
      this.csvFilterList = this.csvData
    }
    else {
      // eslint-disable-next-line prefer-const
      let dataList: string[] = []
      $event.forEach(data => {
        const tmpDatas: any[] = filter(this.csvData, (o: string[]) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          return o[key].includes(data.value)
        })
        tmpDatas.forEach((data2: string) => {

          dataList.push(data2)
        })
      })

      this.csvFilterList = dataList
    }

  }

}
