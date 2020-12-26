import { TaskService, contracts } from '../services/task.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TaskReslove implements Resolve<contracts> {
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): contracts | Observable<contracts> | Promise<contracts> {
        let taskId: number = route.params['tid'];
        return this.taskService.getTaskById(taskId);
    }
    constructor(public taskService: TaskService, public Router: Router) {}
}
