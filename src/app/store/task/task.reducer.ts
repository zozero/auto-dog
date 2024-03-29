import { createReducer, on } from '@ngrx/store';
import { TaskActions } from './task.actions';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { TaskExecuteResultInfo, TaskStoreState } from '../../core/interface/execute-type';

export const taskFeatureKey = 'task';

export interface State extends EntityState<TaskStoreState>{}

export const TaskAdater:EntityAdapter<TaskStoreState>=createEntityAdapter<TaskStoreState>()

export const initialState: State = TaskAdater.getInitialState();

export const TaskReducer = createReducer(
  initialState,
  on(TaskActions['添加任务'],(state,action)=>TaskAdater.addOne({
    id:(action.taskResultList as TaskExecuteResultInfo[])[0] ['projectName'],
    taskResultList:action.taskResultList
  },state)),
);

