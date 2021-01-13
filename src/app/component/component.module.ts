import { FunnelComponent } from './funnel/funnel.component';
import { ReplyModeComponent } from './reply-mode/reply-mode.component';
import { CommitReplyComponent } from './commit-reply/commit-reply.component';
import { NgZorroAntdModule, NzTreeService } from 'ng-zorro-antd';
import { TrackExcludeComponent } from './track-exclude/track-exclude.component';
import { ConfirmedPopupBoxComponent } from './confirmed-popupbox/confirmed-popupbox.component';
import { TdOverflowTextComponent } from './td-overflow-text/td-overflow-text.component';
import { LoaddingComponent } from './loadding/loadding.component';
import { PaginationComponent } from './pagination/pagination.component';
import { SortComponent } from './sort/sort.component';
import { DirectiveModule } from './../directive/directive.module';
import { ProgressComponent } from './progress/progress.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule } from '@angular/forms';
import { UploadimgComponent } from './uploadimg/uploadimg.component';
import { NoDataShowComponent } from './no-data-show/no-data-show.component';
import { ReplyComponent } from './reply/reply.component';
import { CompareTextPipe } from '../pipe/compare-text.pipe';
import { PermissionTreeComponent } from './permission-tree/permission-tree.component';
import { SkuInfoComponent } from './sku-info/sku-info.component';
import { EditorComponent } from './editor/editor.component';

@NgModule({
    declarations: [
        ProgressComponent,
        SortComponent,
        PaginationComponent,
        UploadimgComponent,
        LoaddingComponent,
        NoDataShowComponent,
        TdOverflowTextComponent,
        ConfirmedPopupBoxComponent,
        TrackExcludeComponent,
        ReplyComponent,
        ReplyModeComponent,
        FunnelComponent,
        CompareTextPipe,
        PermissionTreeComponent,
        SkuInfoComponent,
        CommitReplyComponent,
        EditorComponent,
    ],
    imports: [CommonModule, DirectiveModule, IonicModule, FormsModule, NgZorroAntdModule, FileUploadModule],
    exports: [
        ProgressComponent,
        SortComponent,
        PaginationComponent,
        UploadimgComponent,
        LoaddingComponent,
        NoDataShowComponent,
        TdOverflowTextComponent,
        ConfirmedPopupBoxComponent,
        TrackExcludeComponent,
        ReplyComponent,
        ReplyModeComponent,
        FunnelComponent,
        CompareTextPipe,
        PermissionTreeComponent,
        SkuInfoComponent,
        CommitReplyComponent,
        EditorComponent,
    ],
    providers: [NzTreeService],
})
export class ComponentModule {}
