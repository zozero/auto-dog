import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule, EditableTip } from 'ng-devui/data-table';
import { InputGroupModule } from 'ng-devui/input-group';
import { DevUIModule, DialogService } from 'ng-devui';
import { ExecutionSideInfo } from '../../../core/interface/config-type';
import { I18nModule } from 'ng-devui/i18n';
import { remove } from 'lodash-es';
import { AddExecutionSideInfoDialogComponent } from './add-execution-side-info-dialog/add-execution-side-info-dialog.component';
import { executionSideTable } from '../../../core/services/dexie-db/execution-side-table.service';

@Component({
  selector: 'app-execution-side-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DevUIModule,
    DataTableModule,
    InputGroupModule,
    I18nModule,
  ],
  templateUrl: './execution-side-table.component.html',
  styleUrl: './execution-side-table.component.scss',
})
export class ExecutionSideTableComponent {
  @Input() dataList!: ExecutionSideInfo[];
  // 发送数据修改的事件
  @Output () updateInfo: EventEmitter<any> = new EventEmitter();
  constructor(private dialogService: DialogService) {}
  // 	可选，编辑提示，hover背景变色，btn展示编辑按钮
  editableTip = EditableTip.hover;

  addData() {
    const results = this.dialogService.open({
      id: 'dialog-service',
      width: '500px',
      maxHeight: '500px',
      title: '添加执行侧数据',
      content: AddExecutionSideInfoDialogComponent,
      dialogtype: 'standard',
      backdropCloseable: true,
      buttons: [
        {
          cssClass: 'primary',
          text: '保存',
          handler: () => {
            // results.modalContentInstance返回 Modal 内容的对象，
            // 如果是组件的话可以使用它调用其内部的函数。
            results.modalContentInstance.addData().then((err: number) => {
              // err等于0是自己捕获错误设置的，如果等于零就不执行了
              if (err !== 0) {
                void executionSideTable
                  .queryExecutionSideLastInfo()
                  .then((curData: ExecutionSideInfo) => {
                    this.dataList.push(curData);
                  });
                // 关闭窗口
                results.modalInstance.hide();
              }
            });
          },
        },
      ],
    });
  }

  beforeEditStart = (rowItem: any, field: any) => {
    // // console.log(rowItem, field);
    return true;
  };

  beforeEditEnd = (rowItem: any, field: any) => {
    void this.updateData(rowItem, field);
    if (rowItem && rowItem[field].length < 3) {
      return false;
    } else {
      return true;
    }
  };

  async updateData(rowItem: any, field: any) {
    const curType = field.replace('Edit', '');
    const data = {
      [curType]: rowItem[curType],
    };
    await executionSideTable.updateExecutionSideInfo(rowItem.id as number, data);
    // 更新时向外部组件发送修改了。
    this.updateInfo.emit();
  }

  deleteData(id: number) {
    void executionSideTable.deleteExecutionSideInfo(id).finally(() => {
      remove(this.dataList, (data:any) => {
        return data.id === id;
      });
    });
  }
}
