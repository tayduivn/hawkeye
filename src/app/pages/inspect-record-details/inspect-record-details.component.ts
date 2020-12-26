import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { BaseDataService } from 'src/app/services/base-data.service';
import { FactoryDetails, InspectingService } from 'src/app/services/inspecting.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-inspect-record-details',
    templateUrl: './inspect-record-details.component.html',
    styleUrls: ['./inspect-record-details.component.scss'],
})
export class InspectRecordDetailsComponent implements OnInit {
    imgOrigin = environment.usFileUrl;
    data: any = {};
    // 产品列表
    productList: any[] = [];
    // 拟合作产品列表
    collaborativeProductList: any[] = [];
    sampleProductList: any = {};
    // have_sample
    isHave_sample: number;
    isProvideSample: number;
    isSampleInformationShow: any;
    factoryAssess: any = {};
    // 存储营业执照的照片
    businessPic: any[] = [];
    // 存储工厂外观照片
    facadePic: any[] = [];
    // 存储车间照片
    plantPic: any[] = [];
    productPic: any[] = [];
    // 存储样品的图片数组
    specimenPic: any = [];
    constructor(
        public baseData: BaseDataService,
        private activatedRoute: ActivatedRoute,
        private inspecting: InspectingService,
        private es: PageEffectService,
    ) {}
    ngOnInit() {
        // this.getInitQueryParams();
        // 获取工厂的详情
        // this.getFactoryDetails(this.query);
        this.activatedRoute.queryParams
            .pipe(
                map(res => res.id),
                switchMap(factory_id => this.inspecting.getFactoryDetails({ factory_id })),
            )
            .subscribe(res => {
                const { data } = res;
                this.data = data;
                // console.log(res);
                this.isHave_sample = data.have_sample - 0;
                this.isProvideSample = data.will_supply - 0;
                this.isSampleInformationShow = (this.isHave_sample && this.isProvideSample) - 0;
                data.rework_business_license_pic.forEach(item => {
                    this.businessPic.push(item.replace('storage/', ''));
                });
                data.rework_facade_pic.forEach(item => {
                    this.facadePic.push(item.replace('storage/', ''));
                });
                data.rework_plant.forEach(item => {
                    this.plantPic.push(item.replace('storage/', ''));
                });
            });

        // 产品列表 getProductList
        this.activatedRoute.queryParams
            .pipe(
                map(res => res.id),
                switchMap(factory_id => this.inspecting.getProductList({ factory_id })),
            )
            .subscribe(res => {
                const { data } = res;
                data.product.forEach(item => {
                    item['lime_light'] ? this.collaborativeProductList.push(item) : this.productList.push(item);
                });
            });

        // 获取样品的信息

        this.activatedRoute.queryParams
            .pipe(
                map(res => res.id),
                switchMap(factory_id => this.inspecting.getSampleInfo({ factory_id })),
            )
            .subscribe(res => {
                const { data } = res;
                data.sample.img_arr.forEach(item => {
                    this.specimenPic.push(item.replace('storage/', ''));
                });
                data.sample ? (this.sampleProductList = data.sample) : (this.sampleProductList = {});
            });

        // 获取评估信息   getAssessInfo

        this.activatedRoute.queryParams
            .pipe(
                map(res => res.id),
                switchMap(factory_id => this.inspecting.getAssessInfo({ factory_id })),
            )
            .subscribe(res => {
                const { data } = res;
                data ? (this.factoryAssess = data) : (this.factoryAssess = {});
            });
    }
}
