import { TaskService, contracts, getPoParams } from '../services/task.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PoListReslove implements Resolve<contracts> {
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): contracts | Observable<contracts> | Promise<contracts> {
        let params: getPoParams = {
            task_id: route.params['tid'],
            factory_group: route.params['fid'],
        };
        if (params.factory_group == 'null') {
            //TODO : 一种未完成 一种完成的 PO列表
            return this.taskService.getDoneContractByTask(params.task_id);
        } else return this.taskService.getPoListByTaskAndFactory(params);
    }
    constructor(public taskService: TaskService, public Router: Router) {}
}
