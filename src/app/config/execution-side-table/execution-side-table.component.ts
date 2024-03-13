import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule, EditableTip } from 'ng-devui/data-table';
import { InputGroupModule } from 'ng-devui/input-group';
import { DevUIModule } from 'ng-devui';
import { ExecutionSideInfo } from '../config-data';
import { I18nModule } from 'ng-devui/i18n';
import { executionSideTable } from '../../core/services/dexie-db/execution-side-table.service';

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
  styleUrl: './execution-side-table.component.scss'
})
export class ExecutionSideTableComponent {
  @Input() dataList!: ExecutionSideInfo[];
  // 	可选，编辑提示，hover背景变色，btn展示编辑按钮
  editableTip = EditableTip.hover;

  addData(){

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
    void executionSideTable.updateExecutionSideInfo(rowItem.id as number, data);
  }
}
