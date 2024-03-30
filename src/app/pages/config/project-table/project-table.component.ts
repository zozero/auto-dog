import { ExecutionSideInfo } from '../../../core/interface/config-type';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule, EditableTip } from 'ng-devui/data-table';
import { SelectModule } from 'ng-devui/select';
import { InputGroupModule } from 'ng-devui/input-group';
import { DevUIModule, DialogService, ToastService } from 'ng-devui';
import { ProjectInfo, SimulatorInfo } from '../../../core/interface/config-type';
import { I18nModule } from 'ng-devui/i18n';
import { remove } from 'lodash-es';
import { AddProjectTableDialogComponent } from './add-project-table-dialog/add-project-table-dialog.component';
import { executionSideTable } from '../../../core/services/dexie-db/execution-side-table.service';
import { simulatorTable } from '../../../core/services/dexie-db/simulator-table.service';
import { projectTable } from '../../../core/services/dexie-db/project-table.service';
import { ConfigHttpService } from '../../../core/services/https/config-http.service';
import { TipsDialogService } from '../../../core/services/tips-dialog/tips-dialog.service';

@Component({
  selector: 'app-project-table',
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
  templateUrl: './project-table.component.html',
  styleUrl: './project-table.component.scss',
})
export class ProjectTableComponent implements OnInit {
  @Input() dataList!: ProjectInfo[];

  simulatorInfoList!: SimulatorInfo[];
  executionSideInfoList!: ExecutionSideInfo[];
  // 	可选，编辑提示，hover背景变色，btn展示编辑按钮
  editableTip = EditableTip.hover;

  constructor(
    private dialogService: DialogService,
    private toastService: ToastService,
    private tipsService: TipsDialogService,
    private configHttpService: ConfigHttpService
  ) { }
  ngOnInit(): void {
    void this.selectClickUpdateDatas('');
  }

  // 更新数据
  async selectClickUpdateDatas(type: string) {
    switch (type) {
      case 'executionSideInfo':
        this.executionSideInfoList =
          await executionSideTable.queryAllExecutionSideInfos();
        break;
      case 'simulatorInfo':
        this.simulatorInfoList = await simulatorTable.queryAllSimulatorInfos();
        break;
      default:
        this.executionSideInfoList =
          await executionSideTable.queryAllExecutionSideInfos();
        this.simulatorInfoList = await simulatorTable.queryAllSimulatorInfos();
        break;
    }
    
    return true;
  }

  onSelectEditEnd(rowItem: any, field: any) {
    void this.updateData(rowItem, field);
    rowItem[field] = false;
  }

  beforeEditStart = (rowItem: any, field: any) => {
    // console.log(rowItem, field);
    void this.selectClickUpdateDatas(field as string)
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
    if (curType == 'name') {
      const oldData: ProjectInfo = await projectTable.queryProjectInfo(rowItem.id as number);
      const oldName = oldData['name']
      const newName = rowItem[curType];
      this.onChangeProjectName(oldName, newName as string, oldData)
    }
    const data = {
      [curType]: rowItem[curType],
    };
    void projectTable.updateProjectInfo(rowItem.id as number, data);
  }

  addData() {
    const results = this.dialogService.open({
      id: 'dialog-service',
      width: '500px',
      maxHeight: '500px',
      title: '添加项目',
      content: AddProjectTableDialogComponent,
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
                void projectTable
                  .queryProjectLastInfo()
                  .then((curData: ProjectInfo) => {
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
  // 删除数据
  deleteData(id: number) {
    void projectTable.deleteProjectInfo(id).finally(() => {
      remove(this.dataList, (data:any) => {
        return data.id === id;
      });
    });
  }
  // 当项目名改变的时候修改项目
  onChangeProjectName(oldName: string, newName: string, projectInfo: ProjectInfo) {
    if (projectInfo.executionSideInfo) {
      this.configHttpService.getMethodCsvFile(
        projectInfo.executionSideInfo.ipPort,
        oldName,
        newName
      ).subscribe({
        next: (data: any) => {
          this.toastService.open({
            value: [{ severity: 'success', summary: '摘要', content: data }],
          })
        },
        error: (err: any) => {
          this.tipsService.responseErrorState(err.status as number)

        },
        complete: () => {
        }

      })
    }
  }

  // 重置数据
  async resetData(){
    this.dataList = await projectTable.queryAllProjectInfos();
  }
}
