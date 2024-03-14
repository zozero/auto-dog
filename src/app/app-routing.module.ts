import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';


const routes: Routes = [
  {
    path: '配置',
    loadComponent: () =>
      import('./config/config.component').then((mod) => mod.ConfigComponent),
  },
  {
    path: '',
    redirectTo:'配置',
    pathMatch: 'full'
  },
  {
    path: '图片处理/:str',
    loadComponent: () =>
      import('./image-process/image-process.component').then(
        (mod) => mod.ImageProcessComponent
      ),
  },
  {
    path: '流程规划/:str',
    loadComponent: () =>
      import('./workflow-planed/workflow-planed.component').then(
        (mod) => mod.WorkflowPlanedComponent
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
