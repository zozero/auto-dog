import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';



@Injectable()
export class TaskEffects {


  constructor(private actions$: Actions) {}
}
