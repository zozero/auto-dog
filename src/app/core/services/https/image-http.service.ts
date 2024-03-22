import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class ImageHttpService {
  constructor(private http: HttpClient) {}

  postUploadImage(
    img: File,
    executionSideUrl: string | undefined,
    projectName: string
  ) {
    // eslint-disable-next-line prefer-const
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = {
      headers: headers,
      params: {
        项目名: projectName,
      },
    };

    // eslint-disable-next-line prefer-const
    let formData = new FormData();
    formData.append('图片', img);
    return this.http.post(
      executionSideUrl + '/方法' + '/上传截图',
      formData,
      options
    );
    // return this.http.post(executionSideUrl + '/', formData, options);
  }
}
