import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges {
    @Input() pagging: pagging;
    @Output() pagechange: EventEmitter<pagging> = new EventEmitter();
    @Output() onPagingTotalChange: EventEmitter<number> = new EventEmitter();
    get pageNum(): number {
        return this.pagging.pageNum;
    }

    get pageTotal(): number {
        return this.pagging.pageTotal;
    }
    @Input() hidePaging: boolean = false;
    paging: number;
    constructor(private es: PageEffectService,private msg: NzMessageService) {}
    pagingTotal: number = 20;
    changePage(num: number) {
        if (num > this.pagging.pageTotal || num < 0) {
            this.msg.error('不能超过页码总数')
            this.paging = 0;
            return;
        }
        this.pagging.pageNum = num;
        this.pagechange.emit(this.pagging);
    }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log(this.pagging)
    }

    regValid(e: any) {
        if (!/^(?!0+(?:\0+)?$)(?:[1-9]\d*|0)(?:\\d{1,2})?$/.test(e.target.value)) {
            e.target.value = null;
        }
    }
    

    ngOnInit() {}

    pagingTotalChange(e: number) {
        this.onPagingTotalChange.emit(e);
    }
}

export interface pagging {
    pageTotal: number;
    pageNum: number;
}
