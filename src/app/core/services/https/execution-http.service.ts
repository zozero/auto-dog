import { Injectable } from '@angular/core';
import { TestStepDataType, TestTaskDataType } from '../../interface/table-type';
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

  // 测试任务数据是否正常执行
  postTestTaskData(
    executionSideUrl: string,
    taskData: TestTaskDataType
  ) {
    // eslint-disable-next-line prefer-const
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = {
      headers: headers,
    };

    return this.http.post(
      executionSideUrl + '/执行' + '/测试任务',
      taskData,
      options
    );
  }

  // 获取csv文件
  getStopExecute(
    executionSideHttp: string,
    projectName: string,
  ) {
    // 禁止获取缓存文件，由于频繁的操作执行端的文件，可能无法在短时间更新，为了防止这样的错误，在这添加头部，告诉它不要缓存。
    const headers: HttpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store, no-cache, must-revalidate, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    })
    return this.http.get(executionSideHttp + '/执行' + '/停止', {
      headers: headers,
      params: {
        项目名: projectName
      },
      responseType: 'blob',
      transferCache: false
    });
  }
}
