import { createReducer, on } from '@ngrx/store';
import { TaskActions } from './task.actions';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { TaskExecuteResultInfo } from '../../core/interface/execute-type';

export const taskFeatureKey = 'task';

export interface State extends EntityState<TaskExecuteResultInfo>{}

export const TaskAdater:EntityAdapter<TaskExecuteResultInfo>=createEntityAdapter<TaskExecuteResultInfo>()

export const initialState: State = TaskAdater.getInitialState();

export const TaskReducer = createReducer(
  initialState,
  on(TaskActions['添加任务'],(state,action)=>TaskAdater.addOne(action,state)),
);

