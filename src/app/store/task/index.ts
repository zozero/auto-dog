import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import * as fromTask from './task.reducer';


export interface TaskState {

  [fromTask.taskFeatureKey]: fromTask.State;
}
// 这边用来添加缓冲区的
export const reducers: ActionReducerMap<TaskState> = {
  [fromTask.taskFeatureKey]: fromTask.TaskReducer,
};


export const metaReducers: MetaReducer<TaskState>[] = isDevMode() ? [] : [];
