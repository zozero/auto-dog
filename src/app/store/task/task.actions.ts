import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TaskExecuteResultInfo } from '../../core/interface/execute-type';

export const TaskActions = createActionGroup({
  source: 'Task',
  events: {
    '添加任务': props<TaskExecuteResultInfo>(),
    
    
  }
});
