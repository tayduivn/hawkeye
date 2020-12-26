import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';

@Injectable({
    providedIn: 'root',
})
export class TrackDataReslove implements Resolve<any> {
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any | Observable<any> | Promise<any> {
        let type: string = route.params['type'];
        let id: number = route.params['cid'];
        if (type == 'set') {
            return this.taskService.getScheduleList(id);
        } else if (type == 'set-status') {
            return this.taskService.getNeedSchedule(id);
        } else return this.taskService.getHistoryDetailByContract(id);
    }
    constructor(public taskService: TaskService, public Router: Router) {}
}
