import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ImageHttpService {
  constructor(private http: HttpClient) { }

  // 截图
  interceptImage(executionSideHttp: string, simulatorHttp: string) {
    return this.http.get(executionSideHttp + '/模拟器屏幕', {
      params: { 模拟器的ip和端口: simulatorHttp },
      responseType: 'blob',
    });
  }

  // 上传图片
  postUploadImage(
    executionSideUrl: string | undefined,
    projectName: string,
    img: File
  ) {

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = {
      headers: headers,
      params: {
        项目名: projectName,
      },
    };

    const formData = new FormData();
    // 图片：是执行端接口的变量名
    formData.append('图片', img);
    return this.http.post(
      executionSideUrl + '/方法' + '/上传截图',
      formData,
      options
    );
  }

  // 上传预览图片，并返回预览图片
  postPreviewImage(
    executionSideUrl: string | undefined,
    threshold: number[],
    img: File
  ): Observable<Blob> {
    const options = {
      params: {
        阈值: threshold[0],
        阈值类型: threshold[1],
      },
      responseType: 'blob' as 'json'
    };

    const formData = new FormData();
    formData.append('图片', img);
    return this.http.post<Blob>(
      executionSideUrl + '/方法' + '/二值转化',
      formData,
      options
    );

  }

  // 上传多张图片
  postUploadMultiImage(
    executionSideUrl: string | undefined,
    projectName: string,
    imgList: File[]
  ) {

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = {
      headers: headers,
      params: {
        项目名: projectName,
      },
    };

    const formData = new FormData();
    for (let i = 0; i < imgList.length; i++) {
      console.log("i", i)
      // 图片列表：是执行端接口的变量名
      formData.append('图片列表', imgList[i]);
    }
    return this.http.post(
      executionSideUrl + '/方法' + '/上传多张截图',
      formData,
      options
    );
  }
}
