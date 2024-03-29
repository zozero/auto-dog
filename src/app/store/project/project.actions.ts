// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ProjectStateType } from '../../core/interface/execute-type';
import { Update } from '@ngrx/entity';

export const ProjectActions = createActionGroup({
  source: 'Project',
  events: {
    '加个任务': props<ProjectStateType>(),
    '加多任务': props<{ projects: ProjectStateType[] }>(),
    '删除任务': props<{ id: number }>(),
    '单改任务': props<{ update: Update<ProjectStateType> }>(),
    '多改任务': props<{ updates: Update<ProjectStateType>[] }>(),
  }
});
