import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, TaskAdater, taskFeatureKey } from './task.reducer';

const {selectIds,selectEntities,selectAll,selectTotal}=TaskAdater.getSelectors();

// 用来获取数据
export const selectTask=createFeatureSelector<State>(taskFeatureKey)
export const selectTaskList=createSelector(selectTask,selectAll)

