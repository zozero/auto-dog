import { Component, Input } from '@angular/core';
import { ProjectInfo } from '../../../core/interface/config-type';
import { DataTableModule, DevUIModule, DialogService, FilterConfig, LoadingService, LoadingType, ModalModule, ToastService } from 'ng-devui';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'ng-devui/input-group';
import { TableHttpService } from '../../../core/services/https/table-http.service';
import { Papa } from 'ngx-papaparse';
import { TipsDialogService } from '../../../core/services/tips-dialog/tips-dialog.service';
import { ExecutionHttpService } from '../../../core/services/https/execution-http.service';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [
    DataTableModule,
    FormsModule,
    InputGroupModule,
    DevUIModule,
    CommonModule,
    ModalModule,
  ],
  templateUrl: './task-table.component.html',
  styleUrl: './task-table.component.scss'
})
export class TaskTableComponent {
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

  constructor(
    private papa: Papa,
    private tableHttp: TableHttpService,
    private toastService: ToastService,
    private tipsService: TipsDialogService,
    private dialogService: DialogService,
    private loadingService: LoadingService,
    private executionHttpService: ExecutionHttpService

  ) { }
}
