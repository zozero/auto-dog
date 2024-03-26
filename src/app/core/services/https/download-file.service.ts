import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {

  constructor() { }

  // 导出为csv文件
  exportCsvFile(csvUrl: string) {
    // eslint-disable-next-line prefer-const
    let a = document.createElement('a');
    a.href = csvUrl;
    document.body.appendChild(a);
    a.click();
  }
}
