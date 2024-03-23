import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BinaryImageMatchMethodType, ImageMatchMethodType } from '../../interface/table-type';
@Injectable({
  providedIn: 'root',
})
export class TableHttpService {
  constructor(private http: HttpClient) { }

  // 获取csv文件
  getMethodCsvFile(
    executionSideHttp: string,
    projectName: string,
    csvFileName: string
  ) {
    return this.http.get(executionSideHttp + '/方法' + '/表格', {
      params: {
        项目名: projectName,
        文件名: csvFileName + '.csv'
      },
      responseType: 'blob',
      transferCache:false
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
      executionSideUrl + '/方法' + '/添加',
      imageArgs,
      options
    );
  }

  // 覆盖csv数据
  putMethodCsvFile(executionSideUrl: string, projectName: string, methodName: string, csvFile: File) {
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
    return this.http.put(executionSideUrl + '/方法' + '/覆盖', formData, options);
  }

    // 创建步骤表格
    putCreateStepCsvFile(executionSideUrl: string, projectName: string, fileName: string, csvFile: File) {
      // eslint-disable-next-line prefer-const
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      const options = {
        headers: headers,
        params: {
          项目名: projectName,
          文件名: fileName
        },
      };
      // eslint-disable-next-line prefer-const
      let formData = new FormData();
      formData.append('csv文件', csvFile);
      return this.http.put(executionSideUrl + '/步骤' + '/创建', formData, options);
    }
}
