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
      import('./pages/config/config.component').then((mod) => mod.ConfigComponent),
  },
  {
    path: '图片处理',
    loadComponent: () =>
      import('./pages/image-process/image-process.component').then(
        (mod) => mod.ImageProcessComponent
      ),
  },
  {
    path: '流程规划',
    loadComponent: () =>
      import('./pages/workflow-planed/workflow-planed.component').then(
        (mod) => mod.WorkflowPlanedComponent
      ),
  },
  {
    path: '方法编辑',
    loadComponent: () =>
      import('./pages/method-edit/method-edit.component').then(
        (mod) => mod.MethodEditComponent
      ),
  },
  {
    path: '步骤编辑',
    loadComponent: () =>
      import('./pages/step-edit/step-edit.component').then(
        (mod) => mod.StepEditComponent
      ),
  },
  {
    path: '任务编辑',
    loadComponent: () =>
      import('./pages/task-edit/task-edit.component').then(
        (mod) => mod.TaskEditComponent
      ),
  },
  {
    path: '执行规划',
    loadComponent: () =>
      import('./pages/execute-plan/execute-plan.component').then(
        (mod) => mod.ExecutePlanComponent
      ),
  },
  {
    path: '图片展馆',
    loadComponent: () =>
      import('./pages/image-gallery/image-gallery.component').then(
        (mod) => mod.ImageGalleryComponent
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
