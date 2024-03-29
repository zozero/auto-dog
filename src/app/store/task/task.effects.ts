import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TaskActions } from './task.actions';
import { map, mergeMap, timer } from 'rxjs';



@Injectable()
export class TaskEffects {


  constructor(private actions$: Actions) {}
  addTaskList=createEffect(()=>{
    return this.actions$.pipe(
      // 找到要执行的动作
      ofType(TaskActions['追加任务']),
      // 与这个动作合并
      mergeMap((arg)=>{
        return timer(5000).pipe(
          // 延迟2秒然后继续执行
          map(()=>TaskActions['添加任务'](arg))
        )
      })
    )
  })
}
