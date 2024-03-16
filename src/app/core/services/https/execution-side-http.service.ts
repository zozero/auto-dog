import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ExecutionSideHttpService {
  constructor(
    private http: HttpClient,
  ) { }

   // 截图
   interceptImage(executionSideHttp:string,simulatorHttp:string){
    return this.http.get(executionSideHttp+'/simulatorScreen', { params:{simulatorIpPort:simulatorHttp},responseType: 'blob'})
  }
}
