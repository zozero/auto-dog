import { Component } from '@angular/core';
import { ExecutionSideInfo } from '../../config-data';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { executionSideTable } from '../../../core/services/dexie-db/execution-side-table.service';
import { TipsDialogService } from '../../../core/services/tips-dialog/tips-dialog.service';
import { DevUIModule } from 'ng-devui';

@Component({
  selector: 'app-add-execution-side-info-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,DevUIModule],
  templateUrl: './add-execution-side-info-dialog.component.html',
  styleUrl: './add-execution-side-info-dialog.component.scss'
})
export class AddExecutionSideInfoDialogComponent {
  mydata:ExecutionSideInfo={
    ipPort:'127.0.0.1:5555'
  }

  constructor(private dialogService: TipsDialogService) {}

  async addData(){
    return await executionSideTable.addtExecutionSideInfo(this.mydata).catch(()=>{
      this.openDialog();
      return 0
    });
  }

  openDialog() {
    this.dialogService.openToEqualDialog('ip:端口');
  }
}
