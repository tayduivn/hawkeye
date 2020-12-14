import { Injectable, EventEmitter } from '@angular/core';
// import * as wangEditor from '../../../node_modules/wangeditor/dist/wangEditor.js';
import { BaseDataService } from './base-data.service.js';
import { environment } from 'src/environments/environment.js';
import { timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

declare var wangEditor;
@Injectable({
    providedIn: 'root',
})
export class CommitService {
    imgOrigin: string = environment.apiUrl;
    currentKey$: EventEmitter<number> = new EventEmitter();
    apply_inspect_no: string;
    sku: string;
    _contract: string;
    index: number;
    public editor: any = null;
    _id: number = 0;

    _destroy: boolean = false;
    constructor(private baseData: BaseDataService) {}

    ngAfterViewInit() {
    }

    ngOnDestroy() {
        this._destroy = true;
    } 

    _init() {
        if (this.editor) this.editor = null;
        this.editor = new (wangEditor as any)('#editorMenu', '#editor');
        this.setEditorConfig();
        timer(50)
            .pipe(takeWhile(() => !this._destroy && this.editor))
            .subscribe(() => {
                this.editor.create();
            });
        // setTimeout(() => {
        //     this.destroy();
        // },10000)
       
    }

    destroy(){
        this.editor.destroy();
    }

    get applyInspectNo() {
        return this.apply_inspect_no;
    }

    set applyInspectNo(input: string) {
        if (!!input) this.apply_inspect_no = input;
    }

    get contract() {
        return this._contract;
    }

    set contract(input: string) {
        if (!!input) this._contract = input;
    }
    get id() {
        return this._id;
    }

    set id(input: number) {
        this._id = input;
    }

    get Sku() {
        return this.sku;
    }

    set Sku(input: string) {
        if (!!input) this.sku = input;
    }

    get Index() {
        return this.index;
    }

    set Index(input: number) {
        if (input !== undefined && input !== null) this.index = input;
    }

    // 富文本编辑器内容变化触发方法
    editorContentChange = html => {
        // console.log(html);
    };

    // 编辑器获取到焦点触发事件
    editorOnFocus = () => {
        // console.log('on focus');
    };

    // 编辑器失去焦点触发事件
    editorOnBlur = html => {
        // console.log('on blur');
        // console.log(html);
    };
    // 编辑器相关配置设置
    setEditorConfig() {
        // 使用 base64 保存图片
        this.editor.config.uploadImgShowBase64 = true;
        // 菜单展示项配置
        // this.editor.customConfig.menus = this.getMenuConfig();
        // 自定义配置颜色（字体颜色、背景色）
        this.editor.config.colors = this.getColorConfig();
        // 表情面板可以有多个 tab ，因此要配置成一个数组。数组每个元素代表一个 tab 的配置
        // this.editor.customConfig.emotions = this.getEmotionsConfig();
        // 自定义字体
        // this.editor.customConfig.fontNames = this.getFontFamilyConfig();
        // 编辑区域的z-index默认为10000
        // this.editor.customConfig.zIndex = 100;
        // 配置编辑器内容改变触发方法
        this.editor.config.onchange = this.editorContentChange;
        // 编辑器获取到焦点触发方法
        this.editor.config.onfocus = this.editorOnFocus;
        // 编辑器失去焦点触发方法
        this.editor.config.onblur = this.editorOnBlur;
        this.editor.config.uploadImgHeaders = {
            Authorization: `Bearer ${this.baseData.userInfo.api_token}`,
        };
        
        this.editor.config.uploadImgServer = `${this.imgOrigin}/task/add_inspection_task_review_summary_pic_video`;
        this.editor.config.uploadFileName = 'img';
        this.editor.config.uploadImgParams = {
            apply_inspection_no: this.applyInspectNo,
            sku: this.Sku,
        };
        this.editor.config.fontNames = [
            '黑体',
            '仿宋',
            '楷体',
            '标楷体',
            '华文仿宋',
            '华文楷体',
            '宋体',
            '微软雅黑',
            'Arial',
            'Tahoma',
            'Verdana',
            'Times New Roman',
            'Courier New',
        ];
        this.editor.config.fontSizes = {
            'x-small': { name: '10px', value: '1' },
            small: { name: '13px', value: '2' },
            normal: { name: '16px', value: '3' },
            large: { name: '18px', value: '4' },
            'x-large': { name: '24px', value: '5' },
            'xx-large': { name: '32px', value: '6' },
            'xxx-large': { name: '48px', value: '7' },
        };
    }

    // 设置可选颜色
    getColorConfig(): string[] {
        return [
            '#ffffff',
            '#000000',
            '#eeece0',
            '#1c487f',
            '#4d80bf',
            '#c24f4a',
            '#8baa4a',
            '#7b5ba1',
            '#46acc8',
            '#f9963b',
            '#0076B8',
            '#E2C08D',
            '#8EE153',
            '#B6001F',
        ];
    }
}
