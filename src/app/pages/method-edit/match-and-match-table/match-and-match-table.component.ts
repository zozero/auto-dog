import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { DataTableModule, EditableTip, FilterConfig, SortDirection, SortEventArg } from 'ng-devui/data-table';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'ng-devui/input-group';
import { DevUIModule, LoadingService, LoadingType, ToastService } from 'ng-devui';
import { TableHttpService } from '../../../core/services/https/table-http.service';
import { Papa, ParseResult } from 'ngx-papaparse';
import { CommonModule } from '@angular/common';
import { ProjectInfo } from '../../../core/interface/config-type';
import { defaultEncode } from '../../../core/mock/app-mock';
import { DialogService, ModalModule } from 'ng-devui/modal';
import { TipsDialogService } from '../../../core/services/tips-dialog/tips-dialog.service';
import { cloneDeep, filter, findIndex, orderBy } from 'lodash-es';
import { DownloadFileService } from '../../../core/services/https/download-file.service';
import { Subject } from 'rxjs';
import { ImagePreviewModule } from 'ng-devui/image-preview';
import { MyLocalStorageService } from '../../../core/services/my-local-storage/my-local-storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatchAndMatchFormComponent } from "../../../shared/components/form/match-and-match-form/match-and-match-form.component";


@Component({
  selector: 'app-match-and-match-table',
  standalone: true,
  templateUrl: './match-and-match-table.component.html',
  styleUrl: './match-and-match-table.component.scss',
  imports: [
    DataTableModule,
    FormsModule,
    InputGroupModule,
    DevUIModule,
    CommonModule,
    ModalModule,
    ImagePreviewModule,
    TranslateModule,
    MatchAndMatchFormComponent
  ]
})
export class MatchAndMatchTableComponent implements OnInit, OnChanges {
  // 按钮点击后的载入提示
  btnShowLoading = false;
  // 表格数据
  csvData: string[] = [];
  // 专用于过滤的csv列表
  csvFilterList: string[] = [];
  // 图片地址列表
  imgSrc: string = '';
  // 表头信息
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
  // 方法的类型
  @Input() methodType: string | number = '匹配再匹配';
  @ViewChild('matchAndMatchForm', { static: true }) matchAndMatchForm!: TemplateRef<any>;
  editableTip = EditableTip.hover;
  // 用于显示图片预览的
  customImageSub = new Subject<HTMLElement>();
  // 是否开启自动保存
  isAutoSave: boolean = true;
  constructor(
    private papa: Papa,
    private tableHttp: TableHttpService,
    private toastService: ToastService,
    private dialogService: DialogService,
    private tipsDialog: TipsDialogService,
    private loadingService: LoadingService,
    private downloadFileService: DownloadFileService,
    private elementRef: ElementRef,
    private myLocalStorage: MyLocalStorageService

  ) { }
  ngOnInit(): void {
    // console.log("MatchAndMatchTableComponent");
    const tmpStr: string | null = this.myLocalStorage.get('autoSave');
    if (tmpStr != null) {
      this.isAutoSave = Boolean(tmpStr);
    }
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
    this.tableHttp.getMethodCsvFile(
      this.projectInfo.executionSideInfo?.ipPort as string,
      this.projectInfo.name,
      this.methodType as string
    )
      .subscribe({
        next: (csv) => {
          const csvParseOptions = {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            complete: (results: ParseResult, _file: any) => {
              // // console.log('Parsed: ', results, file);
              const arr = results.data;
              this.csvHeader = arr[0]
              // 丢掉第一行数据
              arr.shift();
              this.csvData = arr;
              // 删除掉最后一行的空数据
              this.csvData.pop();
              this.csvFilterList = cloneDeep(this.csvData);
              // 设置筛选数据
              this.setOrdinalFilterList();
              this.setImgNameFilterList();
              // this.filterListMulti=JSON.parse(JSON.stringify(arr))
            },
            encoding: defaultEncode,
            // header:true,
            newline: undefined
          };
          this.papa.parse(csv, csvParseOptions);
          // Add your options here
        },
        error: (err: any) => {
          this.csvData = []
          this.csvFilterList = [];
          this.ordinalFilterList = []
          this.imgNameFilterList = []

          this.tipsDialog.responseErrorState(err.status as number)
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
    // 打开载入效果
    this.btnShowLoading = true
    // 准备数据
    // eslint-disable-next-line prefer-const
    let csvArr = [this.csvHeader].concat(this.csvData);
    // 这里必须要加空一行必然可能导致执行的pandas无法正常加数据
    csvArr.push([''])
    const csvStr = this.papa.unparse(csvArr);
    const csvBlob = new Blob([csvStr], { type: 'text/csv' });
    const csvFile = new File([csvBlob], 'something.csv', { type: 'text/csv' });

    // 发送请求
    this.tableHttp
      .putMethodCsvFile(
        this.projectInfo.executionSideInfo?.ipPort as string,
        this.projectInfo.name,
        this.methodType as string,
        csvFile
      )
      .subscribe(
        {
          next: (data: any) => {
            this.toastService.open({
              value: [{ severity: 'success', summary: '摘要', content: data }],
            })
          },
          error: (err: any) => {
            this.tipsDialog.responseErrorState(err.status as number)
            // 关闭载入效果
            this.btnShowLoading = false
          },
          complete: () => {
            // 关闭载入效果
            this.btnShowLoading = false
          }
        }
      );
    return true
  }

  // 排序方式改变
  onSortChange(event: SortEventArg, field: number) {
    if (event.direction === SortDirection.ASC) {
      // 转成数字才能按照数字排序
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.csvFilterList = orderBy(this.csvFilterList, [(data: any) => parseInt(data[field])], ['asc'])

    } else if (event.direction === SortDirection.DESC) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.csvFilterList = orderBy(this.csvFilterList, [(data: any) => parseInt(data[field])], ['desc'])

    }
    else {
      this.csvFilterList = cloneDeep(this.csvData)
    }
  }

  // 多选过滤改变
  filterChangeMutil($event: FilterConfig[], key: number) {
    if ($event.length === this.csvData.length) {
      this.csvFilterList = cloneDeep(this.csvData)
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

      this.csvFilterList = cloneDeep(dataList)
    }

  }
  // 删除数据
  deleteData(index: number) {
    const csvIndex = findIndex(this.csvData, (o: any) => { return o[0] === this.csvFilterList[index][0] })
    this.csvFilterList.splice(index, 1);
    this.csvData.splice(csvIndex, 1);
    this.putCsvFile()

  }

  // 导出为csv文件
  exportCsvFile() {
    const csvUrl = this.projectInfo.executionSideInfo?.ipPort + '/方法' + '/表格?' + '项目名=' + this.projectInfo.name + '&文件名=' + this.methodType
    this.downloadFileService.exportCsvFile(csvUrl);
  }

  // 打开图片
  openImage(name: string) {
    const tmpStr = this.projectInfo.executionSideInfo?.ipPort + '/项目文件屋/' + this.projectInfo.name + '/图片间/'
    this.imgSrc = tmpStr + name + '.jpg'
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.customImageSub.next(this.elementRef.nativeElement.querySelector('img'));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeEditEnd = (rowItem: any, field: any) => {
    const csvIndex = findIndex(this.csvData, (o: any) => { return o[0] === rowItem[0] })
    this.csvData[csvIndex] = rowItem
    if (this.isAutoSave) {
      this.putCsvFile();
    }
    return true
  };

  // 改变自动保存的状态
  onChageAutoSave($event: any) {
    if ($event) {
      this.myLocalStorage.set('autoSave', '1')
    }
    else {
      this.myLocalStorage.set('autoSave', '')
    }
  }

  addMatchAndMatchData() {
    this.dialogService.open({
      id: 'add-match-and-match-data',
      width: '460px',
      maxHeight: '600px',
      title: '添加匹配再匹配',
      contentTemplate: this.matchAndMatchForm,
      backdropCloseable: true,
      onClose: () => {
        this.getcsvFile();
      },
      buttons: [

      ],
    });
  }
}
