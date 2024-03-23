import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BinaryImageMatchMethodType, ImageMatchMethodType, StepTableType } from '../../interface/table-type';
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
        文件名: csvFileName
      },
      responseType: 'blob',
      transferCache: false
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


  // 获取步骤csv文件列表
  getStepCsvFileList(
    executionSideHttp: string,
    projectName: string
  ) {
    return this.http.get(executionSideHttp + '/步骤' + '/文件列表', {
      params: {
        项目名: projectName,
      }
    });
  }

  // 删除步骤csv文件
  deleteStepCsvFile(
    executionSideHttp: string,
    projectName: string,
    fileName: string
  ) {
    return this.http.delete(executionSideHttp + '/步骤' + '/删除文件', {
      params: {
        项目名: projectName,
        文件名: fileName
      }
    });
  }

  
  // 获得步骤csv文件
  getStepCsvFile(
    executionSideHttp: string,
    projectName: string,
    fileName: string
  ) {
    return this.http.get(executionSideHttp + '/步骤' + '/表格', {
      params: {
        项目名: projectName,
        文件名: fileName
      },
      responseType: 'blob',
      transferCache: false
    });
  }
  
  // 覆盖步骤csv数据
  putStepCsvFile(executionSideUrl: string, projectName: string, fileName: string, csvFile: File) {
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
    return this.http.put(executionSideUrl + '/步骤' + '/覆盖', formData, options);
  }

  // 添加csv数据
  postStepAddData(
    executionSideUrl: string,
    projectName: string,
    fileName: string,
    stepArgs: StepTableType
  ) {
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

    return this.http.post(
      executionSideUrl + '/步骤' + '/添加',
      stepArgs,
      options
    );
  }
}
