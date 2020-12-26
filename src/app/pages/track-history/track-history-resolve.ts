import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { contracts, TaskService } from 'src/app/services/task.service';

@Injectable({
    providedIn: 'root',
})
export class TrackHistoryReslove implements Resolve<contracts> {
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): contracts | Observable<contracts> | Promise<contracts> {
        let cid: number = route.params['cid'];
        return this.taskService.getHistoryList(cid);
    }
    constructor(public taskService: TaskService, public Router: Router) {}
}
