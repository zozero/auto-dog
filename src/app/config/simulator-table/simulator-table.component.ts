import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule, EditableTip } from 'ng-devui/data-table';
import { SelectModule } from 'ng-devui/select';
import { InputGroupModule } from 'ng-devui/input-group';
import { DevUIModule, DialogService } from 'ng-devui';
import { SimulatorInfo } from '../config-data';
import { I18nModule } from 'ng-devui/i18n';
import { simulatorTable } from '../../core/services/dexie-db/simulato-table.service';
import { SimulatorTableDialogComponent } from './simulator-table-dialog/simulator-table-dialog.component';

export const simulatorType = ['安卓', '其他'];

@Component({
  selector: 'app-simulator-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DevUIModule,
    DataTableModule,
    SelectModule,
    InputGroupModule,
    I18nModule,
  ],
  templateUrl: './simulator-table.component.html',
  styleUrl: './simulator-table.component.scss',
})
export class SimulatorTableComponent {
  @Input() dataList!: SimulatorInfo[];
  simulatorType = simulatorType;
  // 	可选，编辑提示，hover背景变色，btn展示编辑按钮
  editableTip = EditableTip.hover;

  constructor(private dialogService: DialogService) {}
  onSelectEditEnd(rowItem: any, field: any) {
    this.updateData(rowItem, field);
    rowItem[field] = false;
  }

  beforeEditStart = (rowItem: any, field: any) => {
    console.log(rowItem, field);
    return true;
  };

  beforeEditEnd = (rowItem: any, field: any) => {
    console.log('beforeEditEnd');
    this.updateData(rowItem, field);
    if (rowItem && rowItem[field].length < 3) {
      return false;
    } else {
      return true;
    }
  };

  updateData(rowItem: any, field: any) {
    const curType = field.replace('Edit', '');
    const data = {
      [curType]: rowItem[curType],
    };
    void simulatorTable.updateSimulatorInfo(rowItem.id as number, data);
  }

  addData() {
    const results = this.dialogService.open({
      id: 'dialog-service',
      width: '500px',
      maxHeight: '500px',
      title: '添加模拟器信息',
      content: SimulatorTableDialogComponent,
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
                void simulatorTable
                  .queryLastData()
                  .then((curData: SimulatorInfo) => {
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
}
