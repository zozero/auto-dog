// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ProjectStateType } from '../../core/interface/execute-type';
import { Update } from '@ngrx/entity';

export const ProjectActions = createActionGroup({
  source: 'Project',
  events: {
    '加个项目': props<ProjectStateType>(),
    '加多项目': props<{ projects: ProjectStateType[] }>(),
    '删除项目': props<{ id: number }>(),
    '单改项目': props<{ update: Update<ProjectStateType> }>(),
    '多改项目': props<{ updates: Update<ProjectStateType>[] }>(),
  }
});
