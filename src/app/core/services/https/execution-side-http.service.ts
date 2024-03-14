import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ExecutionSideInfo, SimulatorInfo } from '../../../config/config-data';
@Injectable({
  providedIn: 'root'
})
export class ExecutionSideHttpService {
  baseHttp:string="http://";
  constructor(
    private http: HttpClient,
  ) { }

  // 截图
  interceptImage(executionSideInfo:ExecutionSideInfo,simulatorInfo:SimulatorInfo){
    console.log("🚀 ~ ExecutionSideHttpService ~ interceptImage ~ simulatorInfo:", simulatorInfo)
    console.log("🚀 ~ ExecutionSideHttpService ~ interceptImage ~ executionSideInfo:", executionSideInfo)
    console.log("🚀 ~ ExecutionSideHttpService ~ baseHttp:", this.baseHttp)
    
  }
}
