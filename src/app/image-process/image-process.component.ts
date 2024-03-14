import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'ng-devui/button';
import { LayoutModule } from 'ng-devui';
import { SelectModule } from 'ng-devui/select';
import { ExecutionSideInfo, SimulatorInfo } from '../config/config-data';
import { FormsModule } from '@angular/forms';
import { simulatorTable } from '../core/services/dexie-db/simulato-table.service';
import { executionSideTable } from '../core/services/dexie-db/execution-side-table.service';



@Component({
  selector: 'app-image-process',
  standalone: true,
  imports: [ButtonModule,LayoutModule,SelectModule,FormsModule],
  templateUrl: './image-process.component.html',
  styleUrl: './image-process.component.scss',
})
export class ImageProcessComponent {
  simulatorInfoList!:SimulatorInfo[];
  executionSideInfoList!:ExecutionSideInfo[];

  currentSimulatorInfo!:SimulatorInfo;
  currentExecutionSide!:ExecutionSideInfo;

  showLoading = false;
  projectName = '';

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((param) => {
      this.projectName = param.str;
    });

    void this.setDatas();
  }
  
  async setDatas(){
    this.simulatorInfoList=await simulatorTable.queryAllSimulatorLastInfos();
    this.currentSimulatorInfo=this.simulatorInfoList[0];
    this.executionSideInfoList=await executionSideTable.queryAllExecutionSideInfos();
    this.currentExecutionSide=this.executionSideInfoList[0];
  }

  toggleLoading() {
    this.showLoading = true;
    setTimeout(() => {
      this.showLoading = false;
    }, 1000);
  }
}
