import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-workflow-planed',
  standalone: true,
  imports: [],
  templateUrl: './workflow-planed.component.html',
  styleUrl: './workflow-planed.component.scss'
})
export class WorkflowPlanedComponent {
  projectName=''
  constructor(
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(param=>{
      this.projectName=param.str
    })
  }
}
