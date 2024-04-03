import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { NgxInfiniteGridComponent, NgxInfiniteGridModule } from '@egjs/ngx-infinitegrid';
import { InfiniteGridItem } from '@egjs/infinitegrid';
import { defaultEncode } from '../../../core/mock/app-mock';
import { Papa, ParseResult } from 'ngx-papaparse';
import { TableHttpService } from '../../../core/services/https/table-http.service';
import { TipsDialogService } from '../../../core/services/tips-dialog/tips-dialog.service';
import { LoadingService, ToastService } from 'ng-devui';
import { ProjectInfo } from '../../../core/interface/config-type';
import { CardModule } from 'ng-devui/card';
import { TagsModule } from 'ng-devui/tags';
import { IconModule } from 'ng-devui/icon';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'app-infinite-gallery',
  standalone: true,
  imports: [
    NgxInfiniteGridModule,
    CommonModule,
    CardModule,
    TagsModule,
    IconModule
  ],
  templateUrl: './infinite-gallery.component.html',
  styleUrl: './infinite-gallery.component.scss'
})
export class InfiniteGalleryComponent implements OnInit, OnChanges {
  // 它就是项目菜单
  @Input() projectInfo!: ProjectInfo;
  // 方法的类型
  @Input() methodType: string | number = '图片匹配';
  // 按钮点击后的载入提示
  btnShowLoading = false;
  // 表格数据
  csvDataList: string[][] = [];
  // 图片地址列表
  imgSrcList: string[] = [];
  // 表头信息
  csvHeader!: string[];


  // 获取裁剪节点
  @ViewChild('ig') public infinite!: NgxInfiniteGridComponent;
  constructor(
    private papa: Papa,
    private tableHttp: TableHttpService,
    private tipsDialog: TipsDialogService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private changeDetectorRef: ChangeDetectorRef,
    protected renderer: Renderer2
  ) { }
  ngOnInit(): void {
    // console.log("InfiniteGalleryComponent");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges) {
    if ('projectInfo' in changes || 'methodType' in changes) {
      this.getcsvFile();
    }
  }

  // 获取图片地址列表
  getImgSrcList() {
    // 先清空数据
    this.imgSrcList = []
    this.csvDataList = []
    this.csvHeader = []
    this.getcsvFile()
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
              const arr = results.data;
              // 先清空数据
              this.imgSrcList = []
              this.csvDataList = []
              this.csvHeader = []

              this.csvHeader = arr[0]
              // 丢掉第一行数据
              arr.shift();
              // 删除掉最后一行的空数据
              arr.pop();
              this.csvDataList = arr;
              // 在添加数据
              const tmpStr = this.projectInfo.executionSideInfo?.ipPort + '/项目文件屋/' + this.projectInfo.name + '/图片间/'
              arr.forEach((element: any) => {
                this.imgSrcList.push(tmpStr + element[1] + '.jpg')
              });
            },
            encoding: defaultEncode,
            // header:true,
            newline: undefined
          };
          this.papa.parse(csv, csvParseOptions);
          // Add your options here
        },
        error: (err: any) => {
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

  // 删除数据
  onDelete(item: InfiniteGridItem) {
    // 由于实在不知道想偷懒，不去研究这个图片显示库，所以不会删除
    // 由此我想到一个绝妙的主意
    const datas: string[][] = cloneDeep(this.csvDataList)
    const srcS: string[] = cloneDeep(this.imgSrcList)
    // 清空原先数据，那么节点会直接没了
    this.csvDataList = []
    this.imgSrcList = []
    // 这必须放在这里，让这个组件检查清空，实际上是清空没渲染的子组件内容
    this.changeDetectorRef.detectChanges();

    // 到这里，组件发现又有数据了，就又安按照正常情况渲染。
    for (let i = 0; i < datas.length; i++) {
      if (parseInt(datas[i][0]) !== parseInt(item.data[0] as string)) {
        this.csvDataList.push(datas[i])
        this.imgSrcList.push(srcS[i])
      }
    }

    this.putCsvFile()
  }

  // 保存csv文件到执行端，这里直接覆盖了
  putCsvFile() {
    // 打开载入效果
    this.btnShowLoading = true
    // 准备数据
    // eslint-disable-next-line prefer-const
    let csvArr = [this.csvHeader].concat(this.csvDataList);
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
  }
}
