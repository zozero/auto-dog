import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, TaskAdater, taskFeatureKey } from './task.reducer';
import { EntityState } from '@ngrx/entity';
import { TaskExecuteResultInfo } from '../../core/interface/execute-type';

const {selectIds,selectEntities,selectAll,selectTotal}=TaskAdater.getSelectors();

// 获取相应状态的对象
export const selectTask=createFeatureSelector<State>(taskFeatureKey)
// 创建选择器，直接使用了上面提供的实体类方法
// 这个以对象方式，返回所有内容
export const selectTaskList=createSelector(selectTask,selectAll)
// 这个以数组方式，返回所有id
export const selectTaskIds=createSelector(selectTask,selectIds)
// 这个以数组方式，返回所有内容
export const selectTaskAll=createSelector(selectTask,selectAll)
// 创建选择器，自己创建一个，
// 第一个参数selectTask，第二个是回调函数，里面有一个state的参数，即状态的参数
export const selectTaskById=(id: number) => createSelector(
    selectTask,
    (data:EntityState<TaskExecuteResultInfo>) => {
        return data.entities[id]
    }
  );