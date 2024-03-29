import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TaskExecuteResultInfo, TaskStoreState } from '../../core/interface/execute-type';

export const TaskActions = createActionGroup({
  source: 'Task',
  events: {
    '添加任务': props<TaskStoreState>(),
    '追加任务': props<TaskStoreState>(),
    
  }
});
