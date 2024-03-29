import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectAdater, State, projectFeatureKey } from './project.reducer';
import { EntityState } from '@ngrx/entity';
import { ProjectStateType } from '../../core/interface/execute-type';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { selectIds, selectEntities, selectAll, selectTotal } = ProjectAdater.getSelectors();

// 获取相应状态的对象
export const selectProject = createFeatureSelector<State>(projectFeatureKey)
// 创建选择器，直接使用了上面提供的实体类方法
// 这个以对象方式，返回所有内容
export const selectProjectList = createSelector(selectProject, selectEntities)
// 这个以数组方式，返回所有id
export const selectProjectIds = createSelector(selectProject, selectIds)
// 这个以数组方式，返回所有内容
export const selectProjectAll = createSelector(selectProject, selectAll)
// 创建选择器，自己创建一个，
// 第一个参数selectProject，第二个是回调函数，里面有一个state的参数，即状态的参数
export const selectProjectById = (id: number) => createSelector(
    selectProject,
    (data: EntityState<ProjectStateType>) => {
        return data.entities[id]
    }
);