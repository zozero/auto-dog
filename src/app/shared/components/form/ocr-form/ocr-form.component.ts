import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { defaulOcrMethodArgs, defaultLanguages } from '../../../../core/mock/match-mock';
import { cloneDeep } from 'lodash-es';
import { OcrLanguageType, OcrMatchMethodType } from '../../../../core/interface/table-type';
import { FormLayout, FormModule } from 'ng-devui/form';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule, ImagePreviewModule, InputNumberModule, LoadingService, ModalService, SelectModule, ToastService } from 'ng-devui';
import { InputGroupModule } from 'ng-devui/input-group';
import { TipsDialogService } from '../../../../core/services/tips-dialog/tips-dialog.service';
import { AiHttpService } from '../../../../core/services/https/ai-http.service';
import { ProjectInfo } from '../../../../core/interface/config-type';
import { Subject } from 'rxjs';
import { TextSelectModalComponent } from "./text-select-modal/text-select-modal.component";

@Component({
  selector: 'app-ocr-form',
  standalone: true,
  templateUrl: './ocr-form.component.html',
  styleUrl: './ocr-form.component.scss',
  imports: [
    CommonModule,
    FormModule,
    FormsModule,
    SelectModule,
    InputNumberModule,
    TranslateModule,
    IconModule,
    ImagePreviewModule,
    InputGroupModule,
    TextSelectModalComponent
  ]
})
export class OcrFormComponent implements OnInit {
  @Input() range!: string;
  @Input() projectInfo!: ProjectInfo;

  @ViewChild('textSelectModal', { static: true }) textSelectModalRef!: TemplateRef<any>;
  // 默认的语种列表
  defaultLanguageList: OcrLanguageType[] = cloneDeep(defaultLanguages);
  // 参数对，初始一个预设的值
  args: OcrMatchMethodType = cloneDeep(defaulOcrMethodArgs);
  // 表单垂直布局
  vertical: FormLayout = FormLayout.Vertical;
  // 用于显示图片预览的
  customImageSub = new Subject<HTMLElement>();
  // 用于预览识别结果图片
  imgPreviewSrc: string = '';
  // 光学字符识别测试返回的数据
  data: any;
  // 用于重新打开，无需再次发送请求
  // textSelectModal:any='';

  constructor(
    private toastService: ToastService,
    private tipsDialog: TipsDialogService,
    private loadingService: LoadingService,
    private elementRef: ElementRef,
    private modalService: ModalService,
    private aiHttpService: AiHttpService

  ) { }
  ngOnInit(): void {
    this.args['范围'] = this.range;
    this.args['语种'] = this.defaultLanguageList[0].编号
  }

  // 打开预览
  openPreviewImage() {
    const loadResult = this.loadingService.open()
    this.aiHttpService.getOcrTest(
      this.projectInfo.executionSideInfo?.ipPort as string,
      this.projectInfo.simulatorInfo?.ipPort as string,
      this.args['范围'],
      this.args['语种']
    ).subscribe({
      next: (data: any) => {
        this.imgPreviewSrc = 'data:image/jpeg;base64,' + data[0];
        data[0] = this.imgPreviewSrc;
        this.data = data;
        // this.customImageSub.next(this.elementRef.nativeElement.querySelector('img'));
        this.openTextSelectModal();
        this.toastService.open({
          value: [{ severity: 'success', summary: '摘要', content: '识别完毕。' }],
        })
      },
      error: (err: any) => {
        loadResult.loadingInstance.close();
        this.tipsDialog.responseErrorState(err.status as number)

      },
      complete: () => {
        loadResult.loadingInstance.close();

      }
    })
  }

  // 解析选择框的值
  parserSelectValue(data: OcrLanguageType) {
    if (data.名称 === undefined) {
      return ''
    } else {
      return data.编号 + "：" + data.名称
    }

  }

  // 打开文本选择模态框
  openTextSelectModal() {
    this.modalService.open({
      id: 'text-select-modal',
      width: '600px',
      backdropCloseable: false,
      contentTemplate: this.textSelectModalRef,
      onClose: () => {
      },
    });
  }

  // 接收选中的数据用于自动填充。
  recvSelectData($event: [[], string, number]) {
    this.args['图片名'] = $event[1] + '文字识别';
    this.args['文本'] = $event[1];
    this.args['最低相似度'] = parseFloat(($event[2] - 0.1).toFixed(2))
  }
}