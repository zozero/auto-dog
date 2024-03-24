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
     // 禁止获取缓存文件，由于频繁的操作执行端的文件，可能无法在短时间更新，为了防止这样的错误，在这添加头部，告诉它不要缓存。
     const headers: HttpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store, no-cache, must-revalidate, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',

    })
    return this.http.get(executionSideHttp + '/方法' + '/表格', {
      headers: headers,
      params: {
        项目名: projectName,
        文件名: csvFileName
      },
      responseType: 'blob',
      transferCache: false
    });
  }

  // 获取方法某个文件的最后一条的序号
  getMethodLastOrder(
    executionSideHttp: string,
    projectName: string,
    csvFileName: string
  ) {
    // 禁止获取缓存文件，由于频繁的操作执行端的文件，可能无法在短时间更新，为了防止这样的错误，在这添加头部，告诉它不要缓存。
    const headers: HttpHeaders = new HttpHeaders({
     'Cache-Control': 'no-store, no-cache, must-revalidate, pre-check=0',
     'Pragma': 'no-cache',
     'Expires': '0',

   })
    return this.http.get(executionSideHttp + '/方法' + '/序号尾巴', {
      headers: headers,
      params: {
        项目名: projectName,
        文件名: csvFileName
      }
    });
  }

  // 添加csv数据
  postMethodAddData(
    executionSideUrl: string,
    projectName: string,
    methodName: string,
    imageArgs: ImageMatchMethodType | BinaryImageMatchMethodType,
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
     // 禁止获取缓存文件，由于频繁的操作执行端的文件，可能无法在短时间更新，为了防止这样的错误，在这添加头部，告诉它不要缓存。
     const headers: HttpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store, no-cache, must-revalidate, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',

    })
    return this.http.get(executionSideHttp + '/步骤' + '/文件列表', {
      headers: headers,
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
    // 禁止获取缓存文件，由于频繁的操作执行端的文件，可能无法在短时间更新，为了防止这样的错误，在这添加头部，告诉它不要缓存。
    const headers: HttpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store, no-cache, must-revalidate, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',

    })
    return this.http.get(executionSideHttp + '/步骤' + '/表格', {
      headers: headers,
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

  // 获取任务csv文件列表
  getTaskCsvFileList(
    executionSideHttp: string,
    projectName: string
  ) {
    // 禁止获取缓存文件，由于频繁的操作执行端的文件，可能无法在短时间更新，为了防止这样的错误，在这添加头部，告诉它不要缓存。
    const headers: HttpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store, no-cache, must-revalidate, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',

    })
    return this.http.get(executionSideHttp + '/任务' + '/文件列表', {
      headers: headers,
      params: {
        项目名: projectName,
      }
    });
  }


    // 获得步骤csv文件
    getTaskCsvFile(
      executionSideHttp: string,
      projectName: string,
      fileName: string
    ) {
      // 禁止获取缓存文件，由于频繁的操作执行端的文件，可能无法在短时间更新，为了防止这样的错误，在这添加头部，告诉它不要缓存。
      const headers: HttpHeaders = new HttpHeaders({
        'Cache-Control': 'no-store, no-cache, must-revalidate, pre-check=0',
        'Pragma': 'no-cache',
        'Expires': '0',
  
      })
      return this.http.get(executionSideHttp + '/任务' + '/表格', {
        headers: headers,
        params: {
          项目名: projectName,
          文件名: fileName
        },
        responseType: 'blob',
        transferCache: false
      });
    }
}
