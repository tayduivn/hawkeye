import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-inspection-storage-list',
    templateUrl: './inspection-storage-list.component.html',
    styleUrls: ['./inspection-storage-list.component.scss'],
})
export class InspectionStorageListComponent implements OnInit {
    constructor() {}
    isVisible: boolean = false;
    queryInfo: any = {
        page: 1,
        paginate: 10,
    };
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
}
