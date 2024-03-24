import { Injectable } from '@angular/core';
import { TestStepDataType } from '../../interface/table-type';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExecutionHttpService {

  constructor(private http: HttpClient) { }

   // 测试步骤数据是否正常执行
   postTestStepData(
    executionSideUrl: string,
    stepData: TestStepDataType
  ) {
    // eslint-disable-next-line prefer-const
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = {
      headers: headers,
    };

    return this.http.post(
      executionSideUrl + '/执行' + '/测试步骤',
      stepData,
      options
    );
  }
}
