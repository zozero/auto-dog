import { Injectable } from '@angular/core';
import { Table } from 'dexie';

import { DexieDBService } from './dexie-db.service';
import { ExecutionSideInfo } from '../../../config/config-data';

@Injectable({
  providedIn: 'root'
})
export class ExecutionSideTableService   extends DexieDBService {
  executionSideInfoTable!: Table<ExecutionSideInfo, number>;

  constructor() {
    super();
  }
}

export const executionSideTable = new ExecutionSideTableService();
