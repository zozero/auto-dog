import { createReducer, on } from '@ngrx/store';
import { ProjectActions } from './project.actions';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { ProjectStateType } from '../../core/interface/execute-type';

export const projectFeatureKey = 'project';

export interface State extends EntityState<ProjectStateType> {

}
export const ProjectAdater:EntityAdapter<ProjectStateType>=createEntityAdapter<ProjectStateType>()

export const initialState: State =ProjectAdater.getInitialState();

export const reducer = createReducer(
  initialState,
  on(ProjectActions['加个任务'],(state,action)=>ProjectAdater.addOne(action,state)),
  on(ProjectActions['加多任务'],(state, { projects }) => {
    return ProjectAdater.addMany(projects, state);
  }),
  on(ProjectActions['删除任务'],(state,action)=>ProjectAdater.removeOne(action.id,state)),
  on(ProjectActions['单改任务'], (state, { update }) => {
    return ProjectAdater.updateOne(update, state);
  }),
   on(ProjectActions['多改任务'], (state, { updates }) => {
    return ProjectAdater.updateMany(updates, state);
  }),
);

