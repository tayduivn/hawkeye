import { TaskService, contracts } from '../services/task.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TaskListReslove implements Resolve<contracts> {
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): contracts | Observable<contracts> | Promise<contracts> {
        console.log(route.params['type']);
        let type = route.params['type'];
        if (type == 'undone') {
            //TODO : 一种未完成 一种完成的 任务列表
            return this.taskService.getTaskList();
        } else return this.taskService.getDoneTaskList();
    }
    constructor(public taskService: TaskService, public Router: Router) {}
}
