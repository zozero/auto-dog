import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule, DialogService, FormLayout, FormModule, LoadingModule, LoadingService, SelectModule, ToastService } from 'ng-devui';
import { TipsDialogService } from '../../../core/services/tips-dialog/tips-dialog.service';
import { ProjectInfo } from '../../../core/interface/config-type';
import { MatchMethodType, StepTableType } from '../../../core/interface/table-type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { StepTableFormComponent } from "../../../shared/components/form/step-table-form/step-table-form.component";
import { cloneDeep } from 'lodash-es';
import { defaultEncodeObj, defaultStepData } from '../../../core/mock/step-mock';
import { TableHttpService } from '../../../core/services/https/table-http.service';
import { Papa } from 'ngx-papaparse';
import { LayoutModule } from 'ng-devui';

@Component({
  selector: 'app-add-step-in-image-dialog',
  standalone: true,
  templateUrl: './add-step-in-image-dialog.component.html',
  styleUrl: './add-step-in-image-dialog.component.scss',
  imports: [
    CommonModule,
    FormModule,
    FormsModule,
    TranslateModule,
    ButtonModule,
    SelectModule,
    LayoutModule,
    StepTableFormComponent,
    LoadingModule,
  ]
})
export class AddStepInImageDialogComponent implements OnInit {
  @Input() data: any;
  // 项目信息
  projectInfo!: ProjectInfo;
  // 方法类型信息
  methodInfo!: MatchMethodType;
  // 图片名
  imageName!: string;
  // 用于关闭弹出宽
  closeDialog!: () => void;
  // 步骤文件列表
  stepFileList: string[]=[];
  // 添加数据的文件
  currentFile!: string;
  createFileName:string='';
  // 需要添加一些预设参数
  args: StepTableType = cloneDeep(defaultStepData);
  // 输入框组合，各种编码，在提交的时候要重新合成数据
  encodeObj = defaultEncodeObj
  // 表单垂直布局
  vertical: FormLayout = FormLayout.Vertical;
  constructor(
    private dialogService: DialogService,
    private tableHttp: TableHttpService,
    private tipsDialog: TipsDialogService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private papa: Papa,
  ) { }

  ngOnInit(): void {
    // 传过了的参数立即赋值
    this.projectInfo = this.data.projectInfo;
    this.methodInfo = this.data.methodInfo;
    this.imageName = this.data.imageName;
    this.closeDialog = this.data.close;

    this.args['名称'] = "去" + this.imageName;
    this.encodeObj['方法编码'] = [this.methodInfo.编码, null]

    this.setStepFileList()
    this.getLastOrder()
  }

  // 设置步骤csv文件列表栏
  setStepFileList() {
    // 数据载入提示
    const loadTip = this.loadingService.open();
    this.tableHttp.getStepCsvFileList(
      this.projectInfo.executionSideInfo?.ipPort as string,
      this.projectInfo.name
    ).subscribe({
      next: (data: any) => {
        // eslint-disable-next-line prefer-const
        let newArr: string[] = []
        data.forEach((el: string) => {
          newArr.push(el.split('.')[0])
        });
        this.stepFileList = newArr
        if (!this.currentFile) {
          this.currentFile = this.stepFileList[0]
        }
      },
      error: (err: any) => {
        this.tipsDialog.responseErrorState(err.status as number)
        // 关闭载入提示
        loadTip.loadingInstance.close();
        // this.closeDialog();
      },
      complete: () => {
        // 关闭载入提示
        loadTip.loadingInstance.close();
      }
    })
  }

  // 获取最后一条数据的序号
  getLastOrder() {
    // 数据载入提示
    const loadTip = this.loadingService.open();
    this.tableHttp.getMethodLastOrder(
      this.projectInfo.executionSideInfo?.ipPort as string,
      this.projectInfo.name,
      this.methodInfo['名称']
    ).subscribe({
      next: (data: any) => {
        this.encodeObj['方法编码'][1] = data
      },
      error: (err: any) => {
        this.tipsDialog.responseErrorState(err.status as number)
        // 关闭载入提示
        loadTip.loadingInstance.close();
        this.closeDialog();
      },
      complete: () => {
        // 关闭载入提示
        loadTip.loadingInstance.close();
      }
    })
  }
  // 关闭这个对话框
  onCloseDialog() {
    this.closeDialog();
  }
  // 添加步骤文件表格
  addStepCsvFile() {
    this.createStepCsvFile()
  }

  // 添加步骤表格
  createStepCsvFile() {
    // 准备数据
    // eslint-disable-next-line prefer-const,
    let csvHeader: string[] = Object.keys(defaultStepData);
    // 这里必须要加空一行必然可能导致执行的pandas无法正常加数据
    const csvArr = [csvHeader].concat(['']);
    const csvStr = this.papa.unparse(csvArr);
    const csvBlob = new Blob([csvStr], { type: 'text/csv' });
    const csvFile = new File([csvBlob], this.createFileName+'.csv', { type: 'text/csv' });

    this.tableHttp.putCreateStepCsvFile(
      this.projectInfo.executionSideInfo?.ipPort as string,
      this.projectInfo.name,
      this.createFileName,
      csvFile
    ).subscribe({
      next: (data: any) => {
        this.toastService.open({
          value: [{ severity: 'success', summary: '摘要', content: data }],
        });
        this.setStepFileList();
      },
      error: (err) => {
        this.tipsDialog.responseErrorState(err.status as number);
      },
      complete: () => {
      }
    }
    )
  }
}
