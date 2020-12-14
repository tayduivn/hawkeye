import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GlobalRedoService {
    refresh: BehaviorSubject<any> = new BehaviorSubject(null);
    constructor() {}

    redo(tab: any) {
        this.refresh.next(tab);
    }
}
