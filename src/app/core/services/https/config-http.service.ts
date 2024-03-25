import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigHttpService {

  constructor(private http: HttpClient) {

  }

  // 获取csv文件
  getMethodCsvFile(
    executionSideHttp: string,
    projectName: string,
    newProjectName: string
  ) {
    // 禁止获取缓存文件，由于频繁的操作执行端的文件，可能无法在短时间更新，为了防止这样的错误，在这添加头部，告诉它不要缓存。
    const headers: HttpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store, no-cache, must-revalidate, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',

    })
    return this.http.get(executionSideHttp + '/配置' + '/修改项目名', {
      headers: headers,
      params: {
        项目名: projectName,
        新名字: newProjectName
      },
    });
  }
}
