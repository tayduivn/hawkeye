import { uploadData } from '../../services/inspection.service';
import { PageEffectService } from '../../services/page-effect.service';
import { BaseDataService } from '../../services/base-data.service';
import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';

@Component({
    selector: 'app-uploadimg',
    templateUrl: './uploadimg.component.html',
    styleUrls: ['./uploadimg.component.scss'],
})
export class UploadimgComponent implements OnInit, OnDestroy {
    ngOnDestroy(): void {
        this.uploader.destroy();
    }

    contract_task_info: uploadData;
    public imgUploadList: Array<imgUpload> = [
        {
            url: '',
            data: '',
            index: null,
        },
    ];

    @ViewChild('fileUpLoad', { static: false })
    fileUpLoad: ElementRef;

    @Input()
    uploadField: string;

    selectedImgLength: number = 0;
    title: string;

    selectedImgUrl: Array<any> = [];
    public uploader: FileUploader = new FileUploader({
        url: this.baseData.apiUrl + '/file/upload',
        method: 'POST',
        isHTML5: true,
        authTokenHeader: 'authorization',
        authToken: 'Bearer ' + this.baseData.userInfo.api_token,
        itemAlias: 'photo',
    });

    initUploader() {
        this.uploader.onBuildItemForm = function (fileItem: FileItem) {
            console.log(fileItem);
        };
    }

    constructor(public baseData: BaseDataService, public effectCtrl: PageEffectService) {}

    selectedFileOnChanged() {
        //选中的事件  input  index: number, type: string, e: any
    }

    upload() {
        let params: uploadData = {
            type: this.uploadField,
            task_id: this.contract_task_info.task_id,
            contract_id: this.contract_task_info.contract_id,
            sku: this.contract_task_info.sku,
        };
        this.contract_task_info.parentSku && (params.parentSku = this.contract_task_info.parentSku);

        this.uploader.setOptions({ additionalParameter: params });
        this.uploader.uploadAll();
    }

    streamline() {
        for (let i = 0; i < this.uploader.queue.length; i++) {
            if (this.uploader.queue[i]) {
            }
        }
    }

    removeImg(img: img) {
        this.uploader.queue[img.uploadID].remove();
    }

    ngOnInit() {
        this.contract_task_info = JSON.parse(sessionStorage.getItem('TASK_CONTRACT_INFO'));
    }
}

export class FileOfGroup {
    constructor(public photo: string | Array<string>) {}
}

export interface img {
    url: ArrayBuffer | string;
    uploadID: number;
    type: string;
    pIndex: number;
}

export interface imgUpload {
    url: string;
    data: string | ArrayBuffer;
    index: number;
}

export interface uploadOtherInfo {
    type: string;
    task_id: number;
    contract_id: number;
    sku: string;
}
