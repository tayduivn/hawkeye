import { Component, OnInit } from '@angular/core';
import { times } from 'types/lodash';

@Component({
    selector: 'app-prepared-list',
    templateUrl: './prepared-list.component.html',
    styleUrls: ['./prepared-list.component.scss'],
})
export class PreparedListComponent implements OnInit {
    constructor() {}
    queryInfo: any = {
        page: 1,
        paginate: 10,
    };
    isVisible: boolean = false;
    pageChanged() {}
    pageSizeChanged() {}
    ngOnInit() {}
    getSearch() {}
    reset() {}
    seeDetail() {
        this.isVisible = true;
    }
    handleCancel() {
        this.isVisible = false;
    }
    handleOk() {
        this.isVisible = false;
    }
    // 撤销
    revocation() {}
}
