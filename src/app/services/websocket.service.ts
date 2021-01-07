import { Observable, Subject, Observer } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    ws: WebSocket;
    constructor() {}

    create(url: string): Observable<any> {
        this.ws = new WebSocket(url);
        return new Observable(obs => {
            this.ws.onopen = msg => obs.next(msg);
            this.ws.onmessage = function(msg){
                obs.next(msg.data);
            }
            this.ws.onerror = obs.error.bind(obs);
            this.ws.onclose = obs.complete.bind(obs);    
        });
    }
    
      // 向服务器端发送消息
      sendMessage(message: any) {
        let that = this
        // console.log(this.ws)
        if(this.ws){
            if (this.ws.readyState===1) {
                this.ws.send(JSON.stringify(message));
            }else{
                // console.log(this.ws.readyState)
            }
        }else{
        	// socket可能还没连接成功，那么延迟一秒再发送消息
            setTimeout(function () {
                that.ws.send(JSON.stringify(message));
            },1000)
        }
    }
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        alert(1)
    }
    
  
}
