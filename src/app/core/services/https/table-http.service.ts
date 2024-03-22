import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BinaryImageMatchMethodType, ImageMatchMethodType } from '../../interface/table-type';
@Injectable({
  providedIn: 'root',
})
export class TableHttpService {
  constructor(private http: HttpClient) { }

  // 截图
  interceptImage(executionSideHttp: string, simulatorHttp: string) {
    return this.http.get(executionSideHttp + '/模拟器屏幕', {
      params: { 模拟器的ip和端口: simulatorHttp },
      responseType: 'blob',
    });
  }
  // 获取csv文件
  getCsvFile(
    executionSideHttp: string,
    projectName: string,
    csvFileName: string
  ) {
    return this.http.get(executionSideHttp + '/方法' + '/表格', {
      params: {
        项目名: projectName,
        文件名: csvFileName + '.csv',
      },
      responseType: 'blob',
    });
  }
  // 添加csv数据
  postMethodAddData(
    imageArgs: ImageMatchMethodType | BinaryImageMatchMethodType,
    executionSideUrl: string,
    projectName: string,
    methodName: string
  ) {
    // eslint-disable-next-line prefer-const
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = {
      headers: headers,
      params: {
        项目名: projectName,
        方法名: methodName
      },
    };

    return this.http.post(
      executionSideUrl + '/方法' + '/添加表格数据',
      imageArgs,
      options
    );
  }

  // 覆盖csv数据
  putCsvFile(executionSideUrl: string, projectName: string, methodName: string, csvFile: File) {
    // eslint-disable-next-line prefer-const
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = {
      headers: headers,
      params: {
        项目名: projectName,
        方法名: methodName
      },
    };
    // eslint-disable-next-line prefer-const
    let formData = new FormData();
    formData.append('csv文件', csvFile);
    return this.http.put(executionSideUrl + '/方法' + '/覆盖表格文件', formData, options);
  }
}
