import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AiHttpService {

  constructor(private http: HttpClient) { }

  // 获得分类列表
  getClassList(
    executionSideHttp: string,
    projectName: string
  ) {
    // 禁止获取缓存文件，由于频繁的操作执行端的文件，可能无法在短时间更新，为了防止这样的错误，在这添加头部，告诉它不要缓存。
    const headers: HttpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store, no-cache, must-revalidate, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Accept': 'application/json'
    })
    return this.http.get(executionSideHttp + '/你只看一次' + '/分类列表', {
      headers: headers,
      params: {
        项目名: projectName
      },
      transferCache: false
    });
  }

  // 添加你只看一次的分类数量
  getAddYoloClass(executionSideUrl: string, projectName: string, className: string) {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    const options = {
      headers: headers,
      params: {
        项目名: projectName,
        分类名: className
      },
    };
    return this.http.get(executionSideUrl + '/你只看一次' + '/分类', options);
  }

  // 添加csv数据
  postYoloData(
    executionSideUrl: string,
    projectName: string,
    imageList: File[],
    textList: File[],
    className: string

  ) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = {
      headers: headers,
      params: {
        项目名: projectName,
        分类名: className
      },
    };

    const formData = new FormData();
    imageList.forEach((image: File) => {
      formData.append('图片列表', image)
    })
    textList.forEach((text: File) => {
      formData.append('标签列表', text)
    })

    return this.http.post(
      executionSideUrl + '/你只看一次' + '/上传数据',
      formData,
      options
    );
  }
}
