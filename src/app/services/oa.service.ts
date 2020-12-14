import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class OaService {
    constructor(private http: HttpClient) {}

    getToken() {
        return this.http.get('https://oa.xdrlgroup.com/api/v1/get_token').toPromise();
    }

    async getUserInfo(job_num: string, token: string) {
        return await this.http
            .get('https://oa.xdrlgroup.com/api/v1/user/info', { params: { job_num, token } })
            .toPromise();
    }
}
