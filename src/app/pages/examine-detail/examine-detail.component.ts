import { WebsocketService } from './../../services/websocket.service';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BaseDataService } from '../../services/base-data.service';
import { ExamineService, Advise, AdviseSummary } from 'src/app/services/examine.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DataCompareService } from 'src/app/services/data-compare.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { ReplyComponent } from 'src/app/component/reply/reply.component';
import { NzMessageService, UploadFile, UploadXHRArgs, UploadChangeParam } from 'ng-zorro-antd';
import { sku } from '../task-add/task-add.page';
import { timer } from 'rxjs';
import { CommitService } from 'src/app/services/commit.service';

const reviewStatus = [
    { key: 0, value: '请选择' },
    { key: 1, value: '验货通过' },
    { key: 2, value: '验货待定' },
    { key: 3, value: '验货不通过' },
    { key: 4, value: '返工验货' },
];
declare var wangEditor;
export interface InspectAppInfo {
    contract_no?: string;
    recommend_status: number;
    review_summary_desc: Array<ExamineDesc>;
    sku: string;
    status: number | any;
    active?: boolean;
    data?: Array<Advise>;
    pic: string[];
    video: string[];
}

export interface ExamineDesc {
    text: string;
    color: string;
}

// declare var ClassicEditor;

@Component({
    selector: 'app-examine-detail',
    templateUrl: './examine-detail.component.html',
    styleUrls: ['./examine-detail.component.scss'],
})
export class ExamineDetailComponent implements OnInit {
    @ViewChild('player', { static: false }) player: ElementRef;
    @ViewChild('content', { static: false }) content: ElementRef;
    @ViewChild('reply', { static: false }) reply: ReplyComponent;
    
    public model = {
        editorData: '<p>Hello, world!哈哈</p>',
    };
    env: any = environment;
    advises: Advise[] = [];
    apply_inspection_no: any;
    inputValue: string = '';
    reviewStatus: Array<{ key: number; value: string }> = reviewStatus;
    status: number = 0;
    @ViewChild('screen', { static: false }) screen: ElementRef;
    @ViewChild('canvas', { static: false }) canvas: ElementRef;
    isReviewer: boolean;
    recommendStatus: number = 0;
    reviewSummary: string = '';
    appInfos: Array<InspectAppInfo> = [];
    shouldRemoveImg: boolean = true;
    currentCommitIndex: number = 0;
    fileList: any[] = [];
    commentValue: string = '';
    color: string = `rgb(0, 0, 0)`;
    _descriptionAry: Array<any> = [];
    editorId: number = new Date().getTime();
    constructor(
        public baseData: BaseDataService,
        private examine: ExamineService,
        private activeRoute: ActivatedRoute,
        private es: PageEffectService,
        private dataCompare: DataCompareService,
        private http: HttpClient,
        private msg: NzMessageService,
        public commitCtrl: CommitService,
        private socket: WebsocketService,
    ) {}
    html = ``;

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.activeRoute.params
            .pipe(
                switchMap(({ ano }) => {
                    this.apply_inspection_no = ano;
                    return this.examine.getReviewAdviseData(ano);
                }),
            )
            .subscribe(res => {
                if (res && res.data) {
                    this.advises = res.data;
                    this.appInfos = res.info;
                    this.isReviewer = res.is_reviewer;
                    this.reviewStatus = res.review_status;
                    this.appInfos.forEach((item, i) => {
                        if (typeof item.review_summary_desc == 'string') {
                            item.review_summary_desc = [{ text: item.review_summary_desc, color: 'rgb(0, 0, 0)' }];
                        } else {
                            if (item && item.review_summary_desc) {
                                if (!item.review_summary_desc.length) {
                                    item.review_summary_desc = [{ text: '', color: 'rgb(0, 0, 0)' }];
                                }
                            } else {
                                item.review_summary_desc = [{ text: '', color: 'rgb(0, 0, 0)' }];
                            }
                        }
                        this._descriptionAry[i] = item.review_summary_desc ? item.review_summary_desc : [];
                    });
                }
            });
    }

    getReview(e: any) {
        this.examine.getReviewAdviseData(this.apply_inspection_no).subscribe(res => {
            this.advises = res.data;
            this.isReviewer = res.is_reviewer;
        });
    }

    onChange({ editor }: any) {
        console.log(editor.getData());
    }

    getPid(e: { id: number; contents: string }) {
        const { id, contents } = e;
        let formData = new FormData();
        formData.append('id', id as any);
        formData.append('apply_inspection_no', this.apply_inspection_no as any);
        formData.append('contents', contents);

        //TODO 此地改为form data上传
        this.http
            .post(this.env.apiUrl + '/task/add_inspection_task_review_advise_data', formData, {
                headers: {
                    Accept: 'multipart/form-data',
                    Authorization: this.baseData.userInfo.api_token
                        ? `Bearer ${this.baseData.userInfo.api_token}`
                        : undefined,
                },
            })
            .subscribe((res: any) => {
                if (!res.data) return;
                this.advises = res.data;
            });
    }

    ngAfterViewInit() {
        timer(1000).subscribe(res => {
            let inputs: Array<ElementRef> = this.content.nativeElement.getElementsByClassName('textarea');
            [].forEach.call(inputs, (item: ElementRef, index: number) => {
                (item as any).style.height = (item as any).scrollHeight + 'px';
                console.log((item as any).style.height);
            });
        });
    }

    activeChange(e: any, p) {
        console.log(p);
    }

    handleSubmit() {
        this.advises = [
            {
                id: 0,
                contents: this.inputValue,
                pid: null,
                created_at: '',
                son: [],
            },
        ];
        this.getPid({ id: 0, contents: this.inputValue });
    }

    dataUrl(img: any) {
        const { id, contents, apply_inspection_no } = {
            id: null,
            contents: this.inputValue,
            apply_inspection_no: this.apply_inspection_no,
        };
        this.examine.addReviewAdvise({ id, contents, apply_inspection_no, img }).subscribe(res => {
            if (!res.data) return;
            this.advises = res.data;
        });
    }

    commitComplete(e: { content: string; id: number }, p: any) {
        const { content, id } = e;
        this.examine
            .addReviewSummaryText({
                review_summary_desc: content,
                apply_inspection_no: this.commitCtrl.applyInspectNo as any,
                sku: this.commitCtrl.Sku,
                contract_no: p.contract_no,
                id: id ? id : this.commitCtrl.id,
            })
            .subscribe(res => {
                this.msg[res.status ? 'success' : 'error'](res.message);
                if (id === 0) this.getData();
                this.commitCtrl.id = res.data.id;
                res.status && this.commitCtrl.currentKey$.next(res.data.id);
                //TODO 正确的应该是这里通知子组件去push到节点

                this;
            });
    }

    statusChange(e: any, p: any) {
        this.dataCompare
            .taskDataReview({
                contract_no: p.contract_no,
                apply_inspection_no: this.apply_inspection_no as any,
                review_status: e,
                sku: p.sku,
            })
            .subscribe(res => {
                this.msg[res.status?"success":"error"](res.message);
                this.socket.sendMessage({ api_token: this.baseData.userInfo.api_token });
            });
    }

    adviceStatusChange(e: any, p: any) {
        this.dataCompare
            .taskAdviceDataReview({
                apply_inspection_no: this.apply_inspection_no as any,
                recommend_status: e,
                sku: p.sku,
            })
            .subscribe(res => {
                this.msg.success(res.message);
            });
    }

    customAddAdvise(id: any = null) {
        let formData = new FormData();
        formData.append('apply_inspection_no', this.apply_inspection_no as any);
        id && formData.append('id', id as any);
        formData.append('contents', this.inputValue);

        return this.http
            .post(this.env.apiUrl + '/task/add_inspection_task_review_advise_data', formData, {
                headers: {
                    Accept: 'multipart/form-data',
                    Authorization: this.baseData.userInfo.api_token
                        ? `Bearer ${this.baseData.userInfo.api_token}`
                        : undefined,
                },
            })
            .subscribe((res: any) => {
                console.log(res);
            });
    }

    deleteReviewAdvise(p: number) {
        this.examine.deleteReviewAdvise({ id: p }).subscribe(res => {
            this.msg.success('删除成功！');
            this.advises = res.data;
        });
    }

    submitSummary(p: any) {
        // this.examine
        //     .addReviewSummaryText({
        //         review_summary_desc: p.review_summary_desc,
        //         apply_inspection_no: this.apply_inspection_no as any,
        //         sku: p.sku,
        //         contract_no: p.contract_no,
        //     })
        //     .subscribe(res => {
        //         this.msg[res.status ? 'success' : 'error'](res.message);
        //     });
    }
    previewImage;
    previewVisible;
    handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj!);
        }
        this.previewImage = file.url || file.preview;
        this.previewVisible = true;
    };

    apiUrl: string = environment.apiUrl;

    customRequestVideo = (e: UploadXHRArgs) => {
        let formData = new FormData();
        formData.append('apply_inspection_no', this.apply_inspection_no);
        formData.append('sku', this.sku.sku);
        formData.append('video', e.file as any, e.file.name);

        return this.http
            .post(this.apiUrl + '/task/add_inspection_task_review_summary_pic_video', formData, {
                headers: {
                    Accept: 'multipart/form-data',
                    Authorization: this.baseData.userInfo.api_token
                        ? `Bearer ${this.baseData.userInfo.api_token}`
                        : undefined,
                },
            })
            .subscribe((res: any) => {
                if (res.status) {
                    e.onSuccess(null, e.file, null);
                    this.appInfos.forEach(item => {
                        if (item.sku == this.sku.sku) {
                            item.video = item.pic && item.video.length ? item.video : [];
                            item.video.push(res.data[0]);
                        }
                    });
                } else e.onError(null, e.file);
            });
    };

    customRequest = (e: UploadXHRArgs) => {
        let formData = new FormData();
        formData.append('apply_inspection_no', this.apply_inspection_no);
        formData.append('img', e.file as any, e.file.name);
        formData.append('sku', this.sku.sku as any);

        return this.http
            .post(this.apiUrl + '/task/add_inspection_task_review_summary_pic_video', formData, {
                headers: {
                    Accept: 'multipart/form-data',
                    Authorization: this.baseData.userInfo.api_token
                        ? `Bearer ${this.baseData.userInfo.api_token}`
                        : undefined,
                },
            })
            .subscribe((res: any) => {
                if (res.status) {
                    e.onSuccess(null, e.file, null);
                    this.appInfos.forEach(item => {
                        if (item.sku == this.sku.sku) {
                            item.pic = item.pic && item.pic.length ? item.pic : [];
                            item.pic.push(res.data[0]);
                        }
                    });
                } else e.onError(null, e.file);
            });
    };
    sku: sku;

    setSku(sku: sku) {
        this.sku = sku;
    }

    seeBigVdo(str: string) {
        this.modalShow = true;
    }

    handleChange(info: UploadChangeParam): void {
        if (info.file.status === 'done') {
            this.msg.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
            this.msg.error(`${info.file.name} 上传失败`);
        }
    }

    commentSubmit(e: string, p, i) {
        const treeItem = {
            apply_inspection_no: this.commitCtrl.applyInspectNo,
            contents: e,
            created_at: new Date().getTime() as any,
            id: null,
            pid: null,
            sku: this.commitCtrl.Sku,
            updated_at: new Date().getTime() as any,
            user: { id: this.baseData.userInfo.id, name: this.baseData.userInfo.name },
            user_id: this.baseData.userInfo.id,
        };
        this.appInfos.forEach(item => {
            if (item.sku === p.sku && item.contract_no === p.contract_no) {
                item.data = [treeItem];
            }
        });
        console.log(p, i);
        this.commitComplete(
            { content: e, id: 0 },
            {
                sku: this.commitCtrl.Sku,
                contract_no: this.commitCtrl._contract,
                apply_inspection_no: this.apply_inspection_no,
            },
        );
    }

    modalShow: boolean;
    modalVideos: any[] = [];
    currentVideo;
    currentIndex: number;
    modalFooter: any[] = [
        {
            label: '关闭',
            size: 'small',
            onClick: () => {
                this.modalShow = false;
                this.modalVideos = [];
                this.currentVideo = '';
            },
        },
    ];

    play() {
        this.player.nativeElement.play();
    }

    // remove(sku: sku, index: number, type: 'pic' | 'video') {
    //     let params: AdviseSummary = {
    //         apply_inspection_no: this.apply_inspection_no,
    //         sku: sku.sku,
    //         filename: sku[type][index],
    //         fileType: type,
    //     };
    //     this.examine.removeReviewSummaryMedia(params).subscribe(res => {
    //         this.msg[res.status ? 'success' : 'error'](res.message);
    //         res.status && sku[type].splice(index, 1);
    //     });
    // }

    delete(i: number, j: number) {
        console.log(i, j);
        this._descriptionAry.forEach((array, index) => {
            if (index === i) {
                array.forEach((element, jIndex) => {
                    if (jIndex === j) array.splice(jIndex, 1);
                });
            }
        });
    }

    setCommitCtrlSkuAndApply(e: boolean, p: any) {
        this.commitCtrl.applyInspectNo = this.apply_inspection_no;
        this.commitCtrl.Sku = p.sku;
        this.commitCtrl.contract = p.contract_no;
    }

    _ready(e) {}

    _destroy: boolean = false;

    _change(e) {}
    ngOnDestroy() {
        this._destroy = true;
        // debugger
        // this.commitCtrl && this.commitCtrl.destroy();
    }
}

function getBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
