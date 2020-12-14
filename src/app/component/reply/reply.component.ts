import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { BaseDataService } from './../../services/base-data.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Advise, ExamineService } from 'src/app/services/examine.service';
import { UploadFile, NzMessageService, UploadChangeParam, UploadXHRArgs } from 'ng-zorro-antd';
 
@Component({
    selector: 'app-reply',
    templateUrl: './reply.component.html',
    styleUrls: ['./reply.component.scss'],
})
export class ReplyComponent implements OnInit {
    apiUrl: string = environment.apiUrl;
    public env: any = environment;
    @Input() set data(input: Advise) {
        if (!!input) { 
            this._data = input;
        }
    }
    @Input() apo: string;
    @ViewChild('screen', { static: false }) screen: ElementRef;
    @Output() onSubmit: EventEmitter<{ id: number; contents: string }> = new EventEmitter();
    @Output() onDataUrl: EventEmitter<ArrayBuffer> = new EventEmitter();
    @Output() onImgOrVideoComplete: EventEmitter<boolean> = new EventEmitter();
    @Output() onDelTreeNode: EventEmitter<number> = new EventEmitter();
    currentComment: Advise = {
        id: null,
        contents: '',
        pid: null,
        path: null,
        inspection_task_pre_id: null,
        created_at: '',
        updated_at: '',
    };
    commentBoxShow: boolean = true;
    _data: Advise = null;
    inputValue: string;
    submitting = false;
    fileList = [];
    previewImage: string | undefined = '';
    previewVisible = false;
    shouldRemoveImg: boolean = true;

    customRequest = (e: UploadXHRArgs) => {
        let formData = new FormData();
        formData.append('apply_inspection_no', this.apo);
        formData.append('id', this.currentComment.id as any);
        formData.append('advise_img', e.file as any, e.file.name);

        return this.http
            .post(this.apiUrl + '/task/add_inspection_task_review_advise_data', formData, {
                headers: {
                    Accept: 'multipart/form-data',
                    Authorization: this.baseData.userInfo.api_token
                        ? `Bearer ${this.baseData.userInfo.api_token}`
                        : undefined,
                },
            })
            .subscribe((res: any) => {
                if (res.status) e.onSuccess(null, e.file, null);
                else e.onError(null, e.file);
                this.onImgOrVideoComplete.emit(true);
                this.commentBoxShow = !this.commentBoxShow;
            });
    };

    customRequestVideo = (e: UploadXHRArgs) => {
        let formData = new FormData();
        formData.append('apply_inspection_no', this.apo);
        formData.append('id', this.currentComment.id as any);
        formData.append('advise_video', e.file as any, e.file.name);
 
        return this.http
            .post(this.apiUrl + '/task/add_inspection_task_review_advise_data', formData, {
                headers: {
                    Accept: 'multipart/form-data',
                    Authorization: this.baseData.userInfo.api_token
                        ? `Bearer ${this.baseData.userInfo.api_token}`
                        : undefined,
                },
            })
            .subscribe((res: any) => {
                if (res.status) e.onSuccess(null, e.file, null);
                else e.onError(null, e.file);
                this.onImgOrVideoComplete.emit(true);
                this.commentBoxShow = !this.commentBoxShow;
            });
    };
    handleChange(info: UploadChangeParam): void {
        if (info.file.status === 'done') {
            this.msg.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
            this.msg.error(`${info.file.name} 上传失败`);
        }
    }

    constructor(
        public baseData: BaseDataService,
        private http: HttpClient,
        private msg: NzMessageService,
        private examine: ExamineService,
    ) { }

    handlePreview = async (file: UploadFile) => { 
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj!);
        }
        this.previewImage = file.url || file.preview;
        this.previewVisible = true;
    };

    handleSubmit(p: Advise) {
        const $this = this;
        let advise: Advise = {
            id: new Date().getTime(),
            contents: this.inputValue,
            pid: p.id,
            inspection_task_pre_id: null,
            created_at: new Date().toString(),
        };

        p.son ? p.son.push(advise) : (p.son = [advise]);
        const { id, contents } = { id: p.id, contents: $this.inputValue };
        $this.onSubmit.emit({ id, contents });
        this.commentBoxShow = !this.commentBoxShow;
        this.msg.success('审核成功！');
    }

    ngOnInit() {}

    tree: Advise;

    recursionTree(pid: number, tree: Advise[]) {
        for (var i = 0; i < tree.length; i++) {
            if (tree[i].id == pid) {
                let advise: Advise = {
                    id: new Date().getTime(),
                    contents: this.inputValue,
                    pid: tree[i].id,
                    inspection_task_pre_id: null,
                    created_at: new Date().toString(),
                };
                tree[i].son.push(advise);
                this.inputValue = '';
            } else {
                if (tree[i].son && tree[i].son.length) {
                    this.recursionTree(pid, tree[i].son);
                } else continue;
            }
        }
    }

    reply(p: Advise) {
        this.currentComment = p;
    }

    delConfirm(p: Advise) {
        if (this.baseData.userInfo.id === p.user.id) this.onDelTreeNode.emit(p.id);
        else this.msg.error('只能删除自己的留言！');
    }
}

function getBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}
