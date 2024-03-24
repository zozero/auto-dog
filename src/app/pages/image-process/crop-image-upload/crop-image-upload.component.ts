import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogService, FormLayout, SelectModule, ToastService } from 'ng-devui';
import { FormModule } from 'ng-devui/form';
import { matchMethodList } from '../../../core/mock/match-mock';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'ng-devui/button';
import { cloneDeep } from 'lodash';
import { MatchMethodType } from '../../../core/interface/table-type';
import { ProjectInfo } from '../../../core/interface/config-type';
import { CropImageInfo } from '../../../core/interface/image-type';
import { ImageMatchFormComponent } from "../../../shared/components/form/image-match-form/image-match-form.component";
import { TableHttpService } from '../../../core/services/https/table-http.service';
import { ImageHttpService } from '../../../core/services/https/image-http.service';
import { TipsDialogService } from '../../../core/services/tips-dialog/tips-dialog.service';
import { AddStepInImageDialogComponent } from '../add-step-in-image-dialog/add-step-in-image-dialog.component';

@Component({
  selector: 'app-crop-image-upload',
  standalone: true,
  templateUrl: './crop-image-upload.component.html',
  styleUrl: './crop-image-upload.component.scss',
  imports: [
    FormModule,
    FormsModule,
    SelectModule,
    CommonModule,
    ButtonModule,
    ImageMatchFormComponent
  ]
})
export class CropImageUploadComponent implements OnInit {
  @Input() data: any;
  // 图片组件的表单视图
  @ViewChild('imageMatchForm') public imageMatchForm!: ImageMatchFormComponent;
  // 裁剪的图片信息
  imageData!: CropImageInfo;
  // 项目信息
  projectInfo!: ProjectInfo;
  // 用于关闭弹出宽
  closeDialog!: () => void;
  // 页面显示参数
  layoutDirection: FormLayout = FormLayout.Vertical;
  // 用于选择方法类型，从而使用不同表单
  matchMethodList: MatchMethodType[] = cloneDeep(matchMethodList);
  // 当前图片匹配方法
  currentMethod: MatchMethodType = this.matchMethodList[0]
  // 发送给匹配方法表单的树
  range: string = '';

  constructor(
    private tableHttp: TableHttpService,
    private imageHttp: ImageHttpService,
    private toastService: ToastService,
    private tipsService: TipsDialogService,
    private dialogService: DialogService,
  ) {

  }

  ngOnInit(): void {
    // 传过了的参数立即赋值
    this.imageData = this.data.imageData;
    this.projectInfo = this.data.projectInfo;
    this.closeDialog = this.data.close;

    this.setCurrentImageMethodData();
  }


  submit() {
    switch (this.currentMethod['名称']) {
      case '图片匹配': {
        const imageFile = new File(
          [this.imageData.blob],
          this.imageMatchForm.args['图片名'] + '.jpg',
          { type: 'image/jpg' }
        );

        // 上传图片
        this.imageHttp
          .postUploadImage(
            this.projectInfo.executionSideInfo?.ipPort as string,
            this.projectInfo.name,
            imageFile
          )
          .subscribe({
            next: (data: any) => {
              this.toastService.open({
                value: [{ severity: 'success', summary: '摘要', content: data }],
              })
            },
            error: (err: any) => {
              this.tipsService.responseErrorState(err.status as number)
              // 关闭载入效果
              this.closeDialog();
            },
            complete: () => {
              // 关闭载入效果
              this.closeDialog();
            }
          });
        // 向csv表格中添加数据
        this.tableHttp
          .postMethodAddData(
            this.projectInfo.executionSideInfo?.ipPort as string,
            this.projectInfo.name,
            this.currentMethod['名称'],
            this.imageMatchForm.args
          )
          .subscribe({
            next: (data: any) => {
              this.toastService.open({
                value: [{ severity: 'success', summary: '摘要', content: data }],
              })
              // 打开添加步骤的弹出框
              this.addStepDialog();
            },
            error: (err: any) => {
              this.tipsService.responseErrorState(err.status as number)
              // 关闭载入效果
              this.data.close();
            },
            complete: () => {
              // 关闭载入效果
              this.data.close();
            }
          })
        break
      }
    }
  }
  // 打开添加步骤的弹出框
  addStepDialog() {
    const config = {
      id: 'add-step-in-image-dialog',
      maxWidth: '900px',
      maxHeight: '600px',
      title: '快捷添加步骤',
      content: AddStepInImageDialogComponent,
      backdropCloseable: true,
      onClose: () => console.log('on dialog closed'),
    };

    const addStepDialog = this.dialogService.open({
      ...config,
      showMaximizeBtn: true,
      dialogtype: 'standard',
      showAnimation: false,
      data: {
        projectInfo: this.projectInfo,
        methodInfo: this.currentMethod,
        imageName: this.imageMatchForm.args['图片名'],
        close: () => {
          addStepDialog.modalInstance.hide();
        },
      },
      buttons: [
      ],
    });
  }
  // 设置当前输入列表的数据，每一次点击截取的时候都需要重新计算一遍
  setCurrentImageMethodData() {
    // 如果参数列表中有J“范围”参数就直接计算范围
    // 范围是左上和右下的坐标
    const baseNum = 50;
    // 四舍五入的计算
    // 不要超出屏幕的范围
    let x1 = Math.round(this.imageData.info.x - baseNum);
    if (x1 < 0) {
      x1 = 0;
    }
    let y1 = Math.round(this.imageData.info.y - baseNum);
    if (y1 < 0) {
      y1 = 0;
    }
    let x2 = x1 + Math.round(this.imageData.info.width + baseNum);
    if (x2 > this.imageData.rowImageInfo.width) {
      x2 = this.imageData.rowImageInfo.width;
    }
    let y2 = y1 + Math.round(this.imageData.info.height + baseNum);
    if (y2 > this.imageData.rowImageInfo.height) {
      y2 = this.imageData.rowImageInfo.height;
    }

    this.range =
      x1 + ' ' + y1 + ' ' + x2 + ' ' + y2;
  }

}
