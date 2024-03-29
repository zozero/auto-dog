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
  on(TaskActions['加个任务'],(state,action)=>TaskAdater.addOne(action,state)),
  on(TaskActions['加多任务'],(state, { tasks }) => {
    return TaskAdater.addMany(tasks, state);
  }),
  on(TaskActions['删除任务'],(state,action)=>TaskAdater.removeOne(action.id,state)),
  on(TaskActions['单改任务'], (state, { update }) => {
    return TaskAdater.updateOne(update, state);
  }),
   on(TaskActions['多改任务'], (state, { updates }) => {
    return TaskAdater.updateMany(updates, state);
  }),
);

