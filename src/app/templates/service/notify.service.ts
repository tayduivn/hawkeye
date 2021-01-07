import { Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class NotifyService {
    unread$: BehaviorSubject<number> = new BehaviorSubject(0);
    list$: BehaviorSubject<Array<Notify>> = new BehaviorSubject([]);
    constructor() {}

    // data:
}

export interface Notify {
    apply_inspection_no: string;
    content: string;
    contract_no: string;
    sku: string;
}

export interface NotifyPayload{
    data: Notify;
    show_num: number;
    type: string;
    uid: number
}
