import { ProjectInfo } from './../../../../core/interface/config-type';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormLayout, FormModule } from 'ng-devui/form';
import { FormsModule } from '@angular/forms';
import { ButtonModule, DialogService, InputNumberModule, LayoutModule } from 'ng-devui';
import { YOLOMatchMethodType } from '../../../../core/interface/table-type';
import { TranslateModule } from '@ngx-translate/core';
import { defaulYoloMatchMethodArgs } from '../../../../core/mock/match-mock';
import { cloneDeep, findIndex } from 'lodash-es';
import { SelectModule } from 'ng-devui/select';
import { ScreenshotInfo } from '../../../../core/interface/image-type';
import { AiHttpService } from '../../../../core/services/https/ai-http.service';
import { classEncodeType } from '../../../../core/interface/http-type';
import { TipsDialogService } from '../../../../core/services/tips-dialog/tips-dialog.service';
import { TableHttpService } from '../../../../core/services/https/table-http.service';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-yolo-form',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    FormsModule,
    InputNumberModule,
    TranslateModule,
    LayoutModule,
    ButtonModule,
    SelectModule,
  ],
  templateUrl: './yolo-form.component.html',
  styleUrl: './yolo-form.component.scss'
})
export class YoloFormComponent implements OnInit {
  @Input() projectInfo!: ProjectInfo;
  @Input() screenshotList!: ScreenshotInfo[];
  // 参数对，初始一个预设的值
  args: YOLOMatchMethodType = cloneDeep(defaulYoloMatchMethodArgs);
  // 分类列表
  classList: classEncodeType[] = [];
  // 专用于创建分类的
  createClassName: string = ''
  // 当前分类
  currentClass!: classEncodeType;
  // 表单垂直布局
  vertical: FormLayout = FormLayout.Vertical;
  // 按钮点击后的载入提示
  btnShowLoading = false;
  // 图片文件列表
  imageFileList: File[] = []
  // 标签文件列表
  textFileList: File[] = []

  constructor(
    private tipsService: TipsDialogService,
    private aiHttpService: AiHttpService,
    private cdRef: ChangeDetectorRef,
    private papa: Papa,
    private dialogService: DialogService,
    private tableHttpService: TableHttpService
  ) {
  }

  ngOnInit(): void {
    this.getClassNumber();
  }

  // 生成标签文本文件
  generateLabelText() {
    this.imageFileList = []
    this.textFileList = []

    for (let i = 0; i < this.screenshotList.length; i++) {
      // 推送图片文件到图片文件列表
      const tmpImageFile = new File(
        [this.screenshotList[i].blob],
        'tmp.jpg',
        { type: 'image/jpg' }
      );
      this.imageFileList.push(tmpImageFile);

      let textData = ''
      const infoList = this.screenshotList[i].cropImageInfos
      const infoLength = infoList.length
      for (let j = 0; j < infoLength; j++) {
        const tmpArg = infoList[j].cropArgs!
        const range = String(tmpArg.比例中心点[0]) + ' ' + String(tmpArg.比例中心点[1]) + ' ' + String(tmpArg.比例尺寸[0]) + ' ' + String(tmpArg.比例尺寸[1])
        textData = textData + this.args['序号'] + ' ' + range + '\r\n'
      }

      console.log(textData)
      const textBlob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
      // 推送文本到文本文件列表
      const tmpTextFile = new File(
        [textBlob],
        'tmp.txt',
        { type: 'text/txt' }
      );
      this.textFileList.push(tmpTextFile)
    }

  }

  // 获得分类的号码，例如80
  getClassNumber(type:string='') {
    this.aiHttpService.getClassList(
      this.projectInfo.executionSideInfo?.ipPort as string,
      this.projectInfo.name
    ).subscribe({
      next: (data: any) => {
        // 转对象为数组
        for (const i in data) {
          this.classList.push({
            分类: data[i] as string,
            编号: parseInt(i)
          })
        }
        this.classList = this.classList.reverse();
        this.currentClass = this.classList[0];
        // 这边需要赋值给参数
        // this.onSelectValueChange(this.currentClass)
        this.cdRef.detectChanges();
        // 如果从提交那里过来的话,防止异步设置错误数据
        console.log("type",type)
        if(type==='submit'){
          
          this.addCsvFile()
        }
      }
    })
  }

  // 用于选择框解析显示的值。
  selectValueParser(data: classEncodeType) {
    if (data['分类'] === undefined) {
      return ''
    } else {
      return data['编号'] + "：" + data['分类']
    }
  }

  // 当下拉选择框数据改变后执行
  // onSelectValueChange($event: classEncodeType) {
  //   this.args['分类'] = $event['分类'];
  //   this.args['编号'] = $event['编号'];
  // }

  // 添加分类
  addClass() {
    if (this.createClassName === '') {
      this.tipsService.openToEmptyDialog('分类名');
      return;
    } else if (this.checkClassRepeat()) {
      this.tipsService.openToEqualDialog('分类名')
      return;
    }
    const config = {
      id: 'add-class-dialog',
      width: '346px',
      maxHeight: '600px',
      zIndex: 1050,
      backdropCloseable: true,
      html: true,
    };
    const results = this.dialogService.open({
      ...config,
      dialogtype: 'warning',
      title: '警告!',
      content: "添加后无法常规移除，训练后绝对不能移除。<br /><br />还没训练之前可在执行端的对应文件内移除。<br /><br />路径：项目文件屋/xxx项目/智能间/你只看一次/配置.yaml。",
      buttons: [
        {
          cssClass: 'primary',
          text: '确定',
          handler: () => {
            this.submitAddClass();
            results.modalInstance.hide();
          },
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: '取消',
          handler: () => {
            results.modalInstance.hide();
          },
        },
      ],
    });
  }

  // 提交添加分类
  submitAddClass() {
    this.aiHttpService.getAddYoloClass(
      this.projectInfo.executionSideInfo?.ipPort as string,
      this.projectInfo.name,
      this.createClassName
    ).subscribe({
      next: (data: any) => {
        this.getClassNumber('submit');
        // 全局提示成功消息
        this.tipsService.globTipsInfo(data as string)
      },
      error: (err: any) => {
        this.tipsService.responseErrorState(err.status as number)
        // 关闭载入效果
        this.btnShowLoading = false

      },
      complete: () => {
        // 关闭载入效果
        this.btnShowLoading = false
      }
    })
  }

  // 提交数据
  submitData() {
    this.args['分类'] = this.currentClass['分类'];
    this.args['序号'] = this.currentClass['编号'];
    this.generateLabelText();

    this.aiHttpService.postYoloData(
      this.projectInfo.executionSideInfo?.ipPort as string,
      this.projectInfo.name,
      this.imageFileList,
      this.textFileList,
      this.args['分类']
    ).subscribe({
      next: (data: any) => {
        // 全局提示成功消息
        this.tipsService.globTipsInfo(data as string)
      },
      error: (err: any) => {
        this.tipsService.responseErrorState(err.status as number)
      },
      complete: () => {
      }
    })
  }

  // 添加你只看一次方法的一条数据,由于创建时不会重复这里就不做判断了
  addCsvFile() {
    this.args['分类'] = this.currentClass['分类'];
    this.args['序号'] = this.currentClass['编号'];

    // // 准备数据 
    // const csvData: string[] = values(this.args) as string[]
    // const csvHeader: string[] = Object.keys(this.args);
    // const csvArr = [csvHeader].concat(csvData);
    // 这里必须要加空一行必然可能导致执行的pandas无法正常加数据
    // csvArr.push([''])
    // const csvStr = this.papa.unparse(csvArr);
    // const csvBlob = new Blob([csvStr], { type: 'text/csv' });
    // const csvFile = new File([csvBlob], 'something.csv', { type: 'text/csv' });
    console.log("this.args",this.args)
    this.tableHttpService.postMethodAddData(
      this.projectInfo.executionSideInfo?.ipPort as string,
      this.projectInfo.name,
      '你只看一次',
      this.args
    ).subscribe({
      next: (data: any) => {
        // 全局提示成功消息
        this.tipsService.globTipsInfo(data as string)
      },
      error: (err: any) => {
        this.tipsService.responseErrorState(err.status as number)
      },
      complete: () => {
      }
    });
  }

  // 更新csv文件,因为特殊需求才需如此,否则真还不如覆盖整个文件.
  updateCsvFile(){
    this.args['分类'] = this.currentClass['分类'];
    this.args['序号'] = this.currentClass['编号'];

    this.tableHttpService.postUpdateMethodAddData(
      this.projectInfo.executionSideInfo?.ipPort as string,
      this.projectInfo.name,
      '你只看一次',
      this.args
    ).subscribe({
      next: (data: any) => {
        // 全局提示成功消息
        this.tipsService.globTipsInfo(data as string)
      },
      error: (err: any) => {
        this.tipsService.responseErrorState(err.status as number)
      },
      complete: () => {
      }
    });
  }

  // 检查分类名是否重复
  checkClassRepeat() {
    const index: number = findIndex(this.classList, (o) => o['分类'] === this.createClassName)
    if (index === -1) {
      return false
    } else {
      return true
    }

  }
}
