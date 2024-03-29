import { isDevMode } from '@angular/core';
import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import * as fromTask from './task/task.reducer';
import * as fromProject from './project/project.reducer';

// 可以有多个状态
export interface TaskState {
  [fromTask.taskFeatureKey]: fromTask.State;
  [fromProject.projectFeatureKey]: fromProject.State;
}

// 这边用来添加缓冲区的，可以有多个不同状态的缓冲区
export const reducers: ActionReducerMap<TaskState> = {
  [fromTask.taskFeatureKey]: fromTask.TaskReducer,
  [fromProject.projectFeatureKey]: fromProject.reducer,
};


export const metaReducers: MetaReducer<TaskState>[] = isDevMode() ? [] : [];
