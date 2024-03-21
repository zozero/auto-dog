import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';


const routes: Routes = [
  {
    path: '',
    redirectTo:'基础配置',
    pathMatch: 'full'
  },
  {
    path: '基础配置',
    loadComponent: () =>
      import('./config/config.component').then((mod) => mod.ConfigComponent),
  },
  {
    path: '图片处理',
    loadComponent: () =>
      import('./image-process/image-process.component').then(
        (mod) => mod.ImageProcessComponent
      ),
  },
  {
    path: '流程规划',
    loadComponent: () =>
      import('./workflow-planed/workflow-planed.component').then(
        (mod) => mod.WorkflowPlanedComponent
      ),
  },
  {
    path: '方法编辑',
    loadComponent: () =>
      import('./method-edit/method-edit.component').then(
        (mod) => mod.MethodEditComponent
      ),
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
