import { Observable, Subject, Observer } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    ws: WebSocket;
    constructor() {}

    create(url: string): Observable<MessageEvent> {
        this.ws = new WebSocket(url);
        return new Observable(obs => {
            this.ws.onmessage = obs.next.bind(obs);
            this.ws.onerror = obs.error.bind(obs);
            this.ws.onclose = obs.complete.bind(obs);
        });
    }

  
}
