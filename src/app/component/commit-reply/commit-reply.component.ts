import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Advise } from 'src/app/services/examine.service';
import { CommitService } from 'src/app/services/commit.service';
import { BaseDataService } from 'src/app/services/base-data.service';
import { takeWhile } from 'rxjs/operators';
import { OaService } from 'src/app/services/oa.service';

@Component({
    selector: 'app-commit-reply',
    templateUrl: './commit-reply.component.html',
    styleUrls: ['./commit-reply.component.scss'],
})
export class CommitReplyComponent implements OnInit {
    _data: Advise = null;
    currentComment: any = {};
    commentBoxShow: boolean;
    editor: any;
    defaultMessage: any = null;
    pushComplete: boolean = false;

    oaToken: string = '';
    @Input() set data(input: Advise) {
        if (!!input) {
            this._data = input;
        }
    }

    @Input() index: number = null;

    @Output() onReply: EventEmitter<boolean> = new EventEmitter();

    @Output() onComplete: EventEmitter<{ content: string; id: number }> = new EventEmitter();
    constructor(public commitCtrl: CommitService, private baseData: BaseDataService, private oa: OaService) {}

    ngOnInit() {}

    ngAfterViewInit() {}

    async getToke(): Promise<any> {
        const { data } = (await this.oa.getToken()) as any;
        this.oaToken = data;
        this.getOaUserInfo('XD118').then(res => {
            console.log(res);
        });
    }

    getOaUserInfo(oa: string) {
        return this.oa.getUserInfo(oa, this.oaToken);
    }

    reply(p: Advise) {
        this.pushComplete = false;
        this.commitCtrl.index = this.index;
        this.currentComment = p;
    }

    editorDataComplete(e: string, id: number) {
        let active: boolean = true;

        //此处id为null只有跟节点的时候
        const data = { content: e, id: id };
        this.onComplete.emit(data);

        this.pushComplete = !this.pushComplete;
        this.commitCtrl.currentKey$.pipe(takeWhile(() => active)).subscribe((res: number) => {
            this.insertTree(id, e, [this._data], res);
            active = false;
        });
    }

    insertTree(id: number, content: string, tree: Array<Advise>, targetId: number) {
        const treeItem = {
            apply_inspection_no: this.commitCtrl.applyInspectNo,
            contents: content,
            created_at: new Date().getTime() as any,
            id: targetId,
            pid: null,
            sku: this.commitCtrl.Sku,
            updated_at: new Date().getTime() as any,
            user: { id: this.baseData.userInfo.id, name: this.baseData.userInfo.name },
            user_id: this.baseData.userInfo.id,
        };
        tree.forEach(item => {
            if (item.id === id) {
                if (item.son && item.son.length) {
                    treeItem.pid = item.id;
                    item.son.push(treeItem);
                    return;
                } else {
                    treeItem.pid = item.id;
                    item.son = [treeItem];
                }
                return;
            } else {
                item.son && item.son.length && this.insertTree(id, content, item.son, targetId);
            }
        });
    }
}
