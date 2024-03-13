import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule, EditableTip } from 'ng-devui/data-table';
import { SelectModule } from 'ng-devui/select';
import { InputGroupModule } from 'ng-devui/input-group';
import { DevUIModule } from 'ng-devui';
import { SimulatorInfo } from '../config-data';
import { I18nModule } from 'ng-devui/i18n';
import { simulatorTable } from '../../core/services/dexie-db/simulato-table.service';

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
}
