import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
// DevUI部分组件依赖angular动画，需要引入animations模块
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


import { AppComponent } from './app.component';


import { DevUIModule } from 'ng-devui';
import { IconModule } from 'ng-devui/icon';
import { MenuModule } from 'ng-devui/menu';
import { LayoutModule } from 'ng-devui';

import { GANTT_GLOBAL_CONFIG } from '@worktile/gantt';
import { zhCN } from 'date-fns/locale';

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>  new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,

    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    DevUIModule,
    MenuModule,
    LayoutModule,
    IconModule

  ],
  providers: [ {
    provide: GANTT_GLOBAL_CONFIG,
    useValue: {
      dateOptions: {
           locale: zhCN
      }
    }
  },],
  bootstrap: [AppComponent]
})
export class AppModule {}
