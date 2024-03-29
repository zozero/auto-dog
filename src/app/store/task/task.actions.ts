import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TaskExecuteResultInfo } from '../../core/interface/execute-type';
import { Update } from '@ngrx/entity';

export const TaskActions = createActionGroup({
  source: 'Task',
  events: {
    '加个任务': props<TaskExecuteResultInfo>(),
    '加多任务': props<{ tasks: TaskExecuteResultInfo[] }>(),
    '删除任务': props<{ id: number }>(),
    '单改任务': props<{ update: Update<TaskExecuteResultInfo> }>(),
    '多改任务': props<{ updates: Update<TaskExecuteResultInfo>[] }>(),
  }
});
