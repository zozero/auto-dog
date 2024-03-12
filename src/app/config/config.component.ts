import { Component } from '@angular/core';
import { configTable } from '../core/services/dexie-db/config-table.service';
import { executionSideTable } from '../core/services/dexie-db/execution-side-table.service';
// import { ConfigData } from './config-data';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
})
export class ConfigComponent {
  version: string = '';
  constructor() {
    void this.setVersion();
    void this.setExecutionSideTable();
  }
  async setExecutionSideTable() {
    await executionSideTable.initExecutionSideInfo();
  }
  async setVersion() {
    await configTable.initConfigData();
    const configData = await configTable.configDataTable
      .where({ id: 1 })
      .toArray();
    if (configData.length) {
      this.version = configData[0].version;
      console.log(this.version);
    }
  }
}
