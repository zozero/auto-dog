import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ProjectInfo } from '../../../core/interface/config-type';
import { DataTableModule, DevUIModule, DialogService, EditableTip, FilterConfig, LoadingService, LoadingType, ModalModule, SortDirection, SortEventArg, ToastService } from 'ng-devui';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'ng-devui/input-group';
import { TableHttpService } from '../../../core/services/https/table-http.service';
import { Papa, ParseResult } from 'ngx-papaparse';
import { TipsDialogService } from '../../../core/services/tips-dialog/tips-dialog.service';
import { ExecutionHttpService } from '../../../core/services/https/execution-http.service';
import { filter, orderBy } from 'lodash';
import { defaultEncode } from '../../../core/mock/app-mock';
import { TaskTableFormComponent } from "../../../shared/components/form/task-table-form/task-table-form.component";

@Component({
    selector: 'app-task-table',
    standalone: true,
    templateUrl: './task-table.component.html',
    styleUrl: './task-table.component.scss',
    imports: [
        DataTableModule,
        FormsModule,
        InputGroupModule,
        DevUIModule,
        CommonModule,
        ModalModule,
        TaskTableFormComponent
    ]
})
export class TaskTableComponent implements OnInit, OnChanges  {
 // 按钮点击后的载入提示
 btnShowLoading = false;
 // 表格数据
 csvData: string[] = [];
 // 专用于过滤的csv列表
 csvFilterList: string[] = [];
 csvHeader!: string[];
 // 序号筛选列表
 ordinalFilterList: FilterConfig[] = []
 // 步骤名称刷选列表
 taskNameFilterList: FilterConfig[] = []
 // 数据的载入提示
 loadingTip!: LoadingType;
 @Input() projectInfo!: ProjectInfo;
 @Input() fileName!: string | number;

 @ViewChild('dialogContent', { static: true }) dialogContent!: TemplateRef<any>;
 editableTip = EditableTip.hover;
  constructor(
    private papa: Papa,
    private tableHttp: TableHttpService,
    private toastService: ToastService,
    private tipsService: TipsDialogService,
    private dialogService: DialogService,
    private loadingService: LoadingService,
    private executionHttpService: ExecutionHttpService

  ) { }

  ngOnInit(): void {
    this.getcsvFile();
  }
  ngOnChanges(changes: SimpleChanges) {
    if ('projectInfo' in changes) {
      this.getcsvFile();
    }
    if ('fileName' in changes) {
      this.getcsvFile();
    }

  }
  // 从执行端获得csv文件，后续可能需要区分文件名
  getcsvFile() {
    // 数据载入提示
    const loadTip = this.loadingService.open();
    this.tableHttp.getTaskCsvFile(
      this.projectInfo.executionSideInfo?.ipPort as string,
      this.projectInfo.name,
      this.fileName as string
    )
      .subscribe({
        next: (csv) => {
          const csvParseOptions = {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            complete: (results: ParseResult, file: any) => {
              console.log('Parsed: ', results, file);
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
            newline: undefined
          };
          this.papa.parse(csv, csvParseOptions);
        },
        error: (err: any) => {
          this.csvData = []
          this.csvFilterList = [];
          this.ordinalFilterList = []
          this.taskNameFilterList = []

          // console.log("err", err);
          // 状态为零可能是服务器没开
          this.tipsService.responseErrorState(err.status as number)
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
  // 设置文件名的筛选列表
  setImgNameFilterList() {
    // 初始化为空
    this.taskNameFilterList = []
    // 设置数据
    this.csvData.forEach((data) => {
      this.taskNameFilterList.push({
        name: data[1],
        value: data[1],
      })
    })
  }

  // 保存csv文件到执行端，这里直接覆盖了
  addTaskData() {
    this.dialogService.open({
      id: 'add-task-data',
      width: '346px',
      maxHeight: '600px',
      title: '添加步骤',
      contentTemplate: this.dialogContent,
      backdropCloseable: true,
      onClose: () => {
        this.getcsvFile();
      },
      buttons: [

      ],
    });


  }

  // 保存csv文件到执行端，这里直接覆盖了
  saveTaskData() {
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
      .putTaskCsvFile(
        this.projectInfo.executionSideInfo?.ipPort as string,
        this.projectInfo.name,
        this.fileName as string,
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
            this.tipsService.responseErrorState(err.status as number )
            // 关闭载入效果
            this.btnShowLoading = false
          },
          complete: () => {
            // 关闭载入效果
            this.btnShowLoading = false
          }
        }
      );
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
  
  // 删除数据
  deleteData(index: number) {
    this.csvData.splice(index, 1);
    this.saveTaskData()

  }

}
