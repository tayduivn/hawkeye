import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from 'src/environments/environment.js';
import { BaseDataService } from 'src/app/services/base-data.service.js';
import { CommitService } from 'src/app/services/commit.service.js';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
    imgOrigin: string = environment.apiUrl;
    defaultMessage: string = '';
    public editor: any;

    public id: number = new Date().getTime();
    @Output() onData: EventEmitter<string> = new EventEmitter();
    constructor(private baseData: BaseDataService, public commit: CommitService) {}

    ngOnInit() {}

    ngAfterViewInit() {
        this.commit._init();
    }
}
