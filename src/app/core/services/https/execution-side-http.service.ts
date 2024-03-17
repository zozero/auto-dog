import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ExecutionSideHttpService {
  constructor(private http: HttpClient) {}

  // 截图
  interceptImage(executionSideHttp: string, simulatorHttp: string) {
    return this.http.get(executionSideHttp + '/simulatorScreen', {
      params: { 模拟器的ip和端口: simulatorHttp },
      responseType: 'blob',
    });
  }
  // 获取csv文件
  getCsvFile(executionSideHttp: string, csvFilePath: string) {
    return this.http.get(executionSideHttp + '/csv', {
      params: { 文件路径: csvFilePath },
      responseType: 'blob',
    });
  }
  // 上传csv文件
  postCsvFile(executionSideUrl: string, csvFilePath: string, csvFile: File) {
    // eslint-disable-next-line prefer-const
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = {
      headers: headers,
      params: { 文件路径: csvFilePath },
    };
    // eslint-disable-next-line prefer-const
    let formData = new FormData();
    formData.append('csv文件', csvFile);
    return this.http.post(executionSideUrl + '/csv', formData, options);
  }
}
