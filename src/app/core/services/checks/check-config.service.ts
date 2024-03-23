import { Injectable } from '@angular/core';
import { MessageTipType } from '../../interface/config-type';

@Injectable({
  providedIn: 'root'
})
export class CheckConfigService {

  constructor() { }


  // 判断端口号是否超过
  checkPort(str: string): MessageTipType {
    const num = parseInt(str.split(':').at(-1) as string);
    if (num < 1024 || num > 65535) {
      const msg: MessageTipType = {
        state: false,
        tip: "端口超出的范围，端口必须1024<=端口<=65535之间"
      }
      return msg;
    } else {
      const msg: MessageTipType = {
        state: true,
        tip: ""
      }
      return msg;
    }
  }
}
