import { Component } from '@angular/core';
import { LayoutModule } from 'ng-devui';
import { SharedModule } from "../../shared/shared.module";
import { ElectronService } from '../../core/services/electron/electron.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-about-dog',
  standalone: true,
  templateUrl: './about-dog.component.html',
  styleUrl: './about-dog.component.scss',
  imports: [
    LayoutModule,
    SharedModule
  ]
})
export class AboutDogComponent {
  constructor
    (
      private electron: ElectronService,
      private router:Router
    ) { }
  openUrl(url: string) {
    if (window.require === undefined) {
      const a = document.createElement('a');
      a.href = url;
      a.target='_blank'
      document.body.appendChild(a);
      a.click();
    }
    else {
      // 由于浏览器和主线程不在一起所以必须通过ipc进行通讯，以下是定义了一个通讯
      // 发送名叫open-url动作，它在app/main.ts文件里面接收。
      this.electron.ipcRenderer.send('浏览器打开链接', url)
    }

  }
}
