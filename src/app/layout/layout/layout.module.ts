import { FinalInstallComponent } from './../../pages/final-install/final-install.component';
import { DataCompareFactoryComponent } from './../../pages/data-compare-factory/data-compare-factory.component';
import { DataCompareDetailComponent } from './../../pages/data-compare-detail/data-compare-detail.component';
import { DataComparePipe } from './../../pipe/data-compare.pipe';
import { DataComparePage } from './../../pages/data-compare/data-compare.page';
import { NgZorroAntdModule, NzIconModule } from 'ng-zorro-antd';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LayoutPage } from './layout.page';
import { OrderTrackPage } from 'src/app/pages/order-track/order-track.page';
import { TrackHistoryComponent } from 'src/app/pages/track-history/track-history.component';
import { TrackHistoryReslove } from 'src/app/pages/track-history/track-history-resolve';
import { ComponentModule } from 'src/app/component/component.module';
import { DirectiveModule } from 'src/app/directive/directive.module';
import { ShareModule } from 'src/app/share/share.module';
import { ApplyInspecListPage } from 'src/app/pages/apply-inspec-list/apply-inspec-list.page';
import { GetContractPage } from 'src/app/pages/get-contract/get-contract.page';
import { InspecListPage } from 'src/app/pages/inspec-list/inspec-list.page';
import { AgGridModule } from 'ag-grid-angular/dist/aggrid.module';
import { OrderGroupingPage } from 'src/app/pages/order-grouping/order-grouping.page';
import { CreatedBatchesPage } from 'src/app/pages/created-batches/created-batches.page';
import { DistribInspecPage } from 'src/app/pages/distrib-inspec/distrib-inspec.page';
import { CreateInspecBatchPage } from 'src/app/pages/create-inspec-batch/create-inspec-batch.page';
import { ExamineInspecPage } from 'src/app/pages/examine-inspec/examine-inspec.page';
import { TrackDataReslove } from 'src/app/pages/track-detail/track-data-reslove';
import { TrackDetailPage } from 'src/app/pages/track-detail/track-detail.page';
import { ProgressUpdateComponent } from 'src/app/component/progress-update/progress-update.component';
import { ProgressItemUpdateComponent } from 'src/app/component/progress-item-update/progress-item-update.component';
import { BoxTypePipe } from 'src/app/pipe/box-type.pipe';
import { CompareHistoryComponent } from 'src/app/component/compare-history/compare-history.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DataCompareDetailService } from 'src/app/guard/data-compare-detail.service';
import { ArrayingContainerComponent } from '../../pages/arraying-container/arraying-container.component';
import { ArrayingDataListComponent } from '../../pages/arraying-data-list/arraying-data-list.component';
import { InstalledCabinetsComponent } from '../../pages/installed-cabinets/installed-cabinets.component';
import { ExamineDetailComponent } from '../../pages/examine-detail/examine-detail.component';
import { DistribInspecToUserComponent } from 'src/app/pages/distrib-inspec-to-user/distrib-inspec-to-user.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { PermissionComponent } from 'src/app/pages/permission/permission.component';
import { RoleComponent } from 'src/app/pages/role/role.component';
import { CreateUserPage } from 'src/app/pages/create-user/create-user.page';
import { CreateDepartmentPage } from 'src/app/pages/create-department/create-department.page';
import { ModifyPwdPage } from 'src/app/pages/modify-pwd/modify-pwd.page';
import { UserGroupComponent } from 'src/app/pages/user-group/user-group.component';
import { FactoryListComponent } from 'src/app/pages/factory-list/factory-list.component';
import { InspectRecordDetailsComponent } from 'src/app/pages/inspect-record-details/inspect-record-details.component';
import { InspectionStorageComponent } from 'src/app/pages/inspection-storage/inspection-storage.component';
import { PreparedListComponent } from 'src/app/pages/prepared-list/prepared-list.component';
import { InspectionStorageListComponent } from 'src/app/pages/inspection-storage-list/inspection-storage-list.component';
const routes: Routes = [
    {
        path: 'dashboard',
        component: LayoutPage,
        children: [
            {
                path: 'order-track',
                component: OrderTrackPage,

                data: { uid: 201, useCache: true, sonIndex: 0 },
            },
            {
                path: 'get-contract',
                component: GetContractPage,

                data: { uid: 202, useCache: true, sonIndex: 1 },
            },
            {
                path: 'order-track/history/:cid',
                component: TrackHistoryComponent,
                resolve: {
                    data: TrackHistoryReslove,
                },
                data: { uid: 203, useCachze: false },
            },

            {
                path: 'track-detail/:type/:cid', // type : 'set'  ||  'history'  ||  'set-status'
                resolve: {
                    data: TrackDataReslove,
                },
                component: TrackDetailPage,
                data: { uid: 2012, useCache: false },
            },
            {
                path: 'apply-inspection',
                data: { uid: 204, useCache: true, sonIndex: 0 },

                component: ApplyInspecListPage,
            },
            {
                path: 'inspection-list',
                component: InspecListPage,
                data: { uid: 205, useCache: true, sonIndex: 1 },
            },
            {
                path: 'order-grouping',
                component: OrderGroupingPage,
                data: { uid: 206, useCache: true, sonIndex: 0 },
            },
            {
                path: 'distributed-group-list',
                component: CreatedBatchesPage,
                data: { uid: 207, useCache: true, sonIndex: 1 },
            },
            {
                path: 'distribute-inspection',
                component: DistribInspecPage,

                data: { uid: 208, useCache: true, sonIndex: 2 },
            },
            {
                path: 'distrib-to-user/:did/:type',
                component: DistribInspecToUserComponent,
                data: { uid: 2081, useCache: false },
            },
            {
                path: 'select-distributed-list',
                component: CreateInspecBatchPage,
                data: { uid: 209, useCache: true, sonIndex: 3 },
            },
            {
                path: 'confirmed-task-list',
                component: ExamineInspecPage,
                data: { uid: 2010, useCache: true, sonIndex: 4 },
            },

            {
                path: 'data-compare-detail/:applyId/:sku/:contract_no',
                component: DataCompareDetailComponent,
                canActivate: [],
                resolve: {
                    data: DataCompareDetailService,
                },
                data: { uid: 20141, useCache: false },
            },
            {
                path: 'data-compare-factory/:ano',
                component: DataCompareFactoryComponent,
                canActivate: [],
                data: { uid: 20142, useCache: false },
            },
            {
                path: 'data-compare-examine/:ano',
                component: ExamineDetailComponent,
                canActivate: [],
                data: { uid: 20143, useCache: false },
            },
            {
                path: 'data-compare',
                component: DataComparePage,
                canActivate: [],
                data: { uid: 2014, useCache: true, sonIndex: 1 },
            },

            {
                path: 'stay-arraying-list',
                component: ArrayingDataListComponent,
                canActivate: [],
                data: { uid: 2015, useCache: true, sonIndex: 0 },
            },
            {
                path: 'arraying-container',
                component: ArrayingContainerComponent,
                canActivate: [],
                data: { uid: 2016, useCache: true, sonIndex: 1 },
            },
            {
                path: 'installed-cabinets',
                component: InstalledCabinetsComponent,
                canActivate: [],
                data: { uid: 2017, useCache: true, sonIndex: 2 },
            },
            {
                path: 'final-cabinets',
                component: FinalInstallComponent,
                canActivate: [],
                data: { uid: 2018, useCache: true, sonIndex: 3 },
            },
            {
                path: 'permission',
                component: PermissionComponent,
                canActivate: [],
                data: { uid: 2019, useCache: true, sonIndex: 0 },
            },
            // {
            //     path: 'role',
            //     component: RoleComponent,
            //     canActivate: [],
            //     data: { uid: 2020, useCache: true, sonIndex: 1 },
            // },
            {
                path: 'develope-list',
                component: CreateDepartmentPage,
                canActivate: [],
                data: { uid: 2021, useCache: true, sonIndex: 2 },
            },
            {
                path: 'user-list',
                component: CreateUserPage,
                canActivate: [],
                data: { uid: 2022, useCache: true, sonIndex: 1 },
            },
            {
                path: 'modify-pwd',
                component: ModifyPwdPage,
                canActivate: [],
                data: { uid: 2023, useCache: true, sonIndex: 2 },
            },
            {
                path: 'user-group',
                component: UserGroupComponent,
                canActivate: [],
                data: { uid: 2024, useCache: true, sonIndex: 1 },
            },
            {
                path: 'factory-inspect',
                component: FactoryListComponent,
                canActivate: [],
                data: { uid: 2025, useCache: true, sonIndex: 0 },
            },
            {
                path: 'inspect-record-details',
                component: InspectRecordDetailsComponent,
                canActivate: [],
                data: { uid: 2026, useCache: true },
            },
            {
                path: 'inspection-storage',
                component: InspectionStorageComponent,
                canActivate: [],
                data: { uid: 2027, useCache: true, sonIndex: 0 },
            },
            {
                path: 'prepared-list',
                component: PreparedListComponent,
                canActivate: [],
                data: { uid: 2028, useCache: true, sonIndex: 1 },
            },
            {
                path: 'inspection-storage-list',
                component: InspectionStorageListComponent,
                canActivate: [],
                data: { uid: 2029, useCache: true, sonIndex: 2 },
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ComponentModule,
        DirectiveModule,
        AgGridModule.withComponents([]),
        ShareModule,
        ReactiveFormsModule,
        IonicModule,
        NgZorroAntdModule,
        NzIconModule,
        FlexLayoutModule,
        RouterModule.forChild(routes),
        ColorPickerModule,
    ],
    declarations: [
        LayoutPage,
        OrderTrackPage,
        TrackHistoryComponent,
        ApplyInspecListPage,
        InspecListPage,
        GetContractPage,
        OrderGroupingPage,
        CreatedBatchesPage,
        DistribInspecPage,
        DistribInspecToUserComponent,
        CreateInspecBatchPage,
        ExamineInspecPage,
        TrackDetailPage,
        ProgressUpdateComponent,
        DataComparePage,
        ProgressItemUpdateComponent,
        DataComparePage,
        DataComparePipe,
        DataCompareDetailComponent,
        BoxTypePipe,
        DataCompareFactoryComponent,
        CompareHistoryComponent,
        ExamineDetailComponent,
        ArrayingDataListComponent,
        ArrayingContainerComponent,
        InstalledCabinetsComponent,
        FinalInstallComponent,
        PermissionComponent,
        RoleComponent,
        CreateUserPage,
        CreateDepartmentPage,
        ModifyPwdPage,
        UserGroupComponent,
        FactoryListComponent,
        InspectRecordDetailsComponent,
        InspectionStorageComponent,
        PreparedListComponent,
        InspectionStorageListComponent,
    ],
})
export class LayoutPageModule {}
