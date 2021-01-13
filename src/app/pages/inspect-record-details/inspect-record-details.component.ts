import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { BaseDataService } from 'src/app/services/base-data.service';
import { InspectingService } from 'src/app/services/inspecting.service';
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
    // 存储工厂外观视频的数组
    facadeVideo: any[] = [];
    // 存储车间照片
    plantPic: any[] = [];
    // 存储车间视频
    plantVideo: any[] = [];
    productPic: any[] = [];
    // 存储产品视频数组
    productVideo: any[] = [];
    // 存储样品的图片数组
    specimenPic: any = [];
    // 存储样品间视频数组
    roomVideo: any[] = [];
    videoUrl: string;
    isVideoShow: boolean;
    constructor(
        public baseData: BaseDataService,
        private activatedRoute: ActivatedRoute,
        private inspecting: InspectingService,
        private es: PageEffectService,
        private elementRef: ElementRef,
    ) {}
    handleTime(time: string): string {
        const date = new Date(time);
        console.log(date);
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        return `${y}-${m}-${d}`;
    }
    ngOnInit() {
        this.isVideoShow = false;
        this.videoUrl = '';

        this.activatedRoute.queryParams
            .pipe(
                map(res => res.id),
                switchMap(factory_id => this.inspecting.getFactoryDetails({ factory_id })),
            )
            .subscribe(res => {
                const { data } = res;
                this.data = data;
                console.log(this.data);

                // console.log(this.data.create_time);
                this.data.create_time = this.handleTime(this.data.create_time);
                if (data.rework_sample_pic && data.rework_sample_pic.length != 0) {
                    data.rework_sample_pic.forEach(item => {
                        this.specimenPic = [];
                        this.specimenPic.push(item.replace('storage/', ''));
                    });
                }
                // console.log(this.specimenPic);

                data.sample ? (this.sampleProductList = data.sample) : (this.sampleProductList = {});
                // console.log(this.sampleProductList);
                // console.log(this.sampleProductList);

                this.data.third_party = data.third_party - 0;
                this.isHave_sample = data.sample.have_sample - 0;
                this.isProvideSample = data.sample.will_supply - 0;
                this.isSampleInformationShow = (this.isHave_sample && this.isProvideSample) - 0;
                this.collaborativeProductList = data.simulation;
                this.productList = data.product;
                console.log(this.productList);

                if (data.rework_business_license_pic && data.rework_business_license_pic.length != 0) {
                    const str = JSON.stringify(data.rework_business_license_pic);
                    this.businessPic = JSON.parse(str);
                    this.businessPic = [];
                    data.rework_business_license_pic.forEach(item => {
                        this.businessPic.push(item.replace('storage/', ''));
                    });
                } else {
                    this.businessPic = [];
                }

                if (data.rework_facade_pic && data.rework_facade_pic.length != 0) {
                    const str = JSON.stringify(data.rework_facade_pic);
                    this.facadePic = JSON.parse(str);
                    this.facadePic = [];
                    data.rework_facade_pic.forEach(item => {
                        this.facadePic.push(item.replace('storage/', ''));
                    });
                } else {
                    this.facadePic = [];
                }

                if (data.rework_plant && data.rework_facade_pic.length != 0) {
                    const str = JSON.stringify(data.rework_facade_pic);
                    this.plantPic = JSON.parse(str);
                    this.plantPic = [];
                    data.rework_plant.forEach(item => {
                        this.plantPic.push(item.replace('storage/', ''));
                    });
                } else {
                    this.plantPic = [];
                }

                if (data.inspect_facade_video && data.inspect_facade_video.length != 0) {
                    const str = JSON.stringify(data.inspect_facade_video);
                    this.facadeVideo = JSON.parse(str);
                    this.facadeVideo = [];
                    data.inspect_facade_video.forEach(item => {
                        this.facadeVideo.push(item.replace('storage/', ''));
                    });
                } else {
                    this.facadeVideo = [];
                }

                if (data.inspect_plant_video && data.inspect_plant_video.length != 0) {
                    const str = JSON.stringify(data.inspect_plant_video);
                    this.plantVideo = JSON.parse(str);
                    this.plantVideo = [];
                    data.inspect_plant_video.forEach(item => {
                        this.plantVideo.push(item.replace('storage/', ''));
                    });
                } else {
                    this.plantVideo = [];
                }

                if (data.inspect_product_video && data.inspect_product_video.length != 0) {
                    const str = JSON.stringify(data.inspect_product_video);
                    this.productVideo = JSON.parse(str);
                    this.productVideo = [];
                    data.inspect_product_video.forEach(item => {
                        this.productVideo.push(item.replace('storage/', ''));
                    });
                } else {
                    this.productVideo = [];
                }

                if (data.inspect_showroom_video && data.inspect_showroom_video.length != 0) {
                    const str = JSON.stringify(data.inspect_showroom_video);
                    this.roomVideo = JSON.parse(str);
                    this.roomVideo = [];
                    data.inspect_showroom_video.forEach(item => {
                        this.roomVideo.push(item.replace('storage/', ''));
                    });
                } else {
                    this.roomVideo = [];
                }
            });
        // 获取评估信息   getAssessInfo

        this.activatedRoute.queryParams
            .pipe(
                map(res => res.id),
                switchMap(factory_id => this.inspecting.getAssessInfo({ factory_id })),
            )
            .subscribe(res => {
                const { data } = res;
                console.log(data);
                // console.log();

                data ? (this.factoryAssess = data) : (this.factoryAssess = {});
            });
    }
    showVideo(link) {
        this.isVideoShow = true;
        this.videoUrl = environment.usFileUrl + link;
    }
    back() {
        console.log('返回了');

        this.isVideoShow = false;
        this.videoUrl = '';
    }
    closeVideo() {
        console.log(1);
        this.isVideoShow = false;
        this.videoUrl = '';
    }
    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        console.log(1);
    }
    // 点击返回前一页的时候清空
    backToMain() {
        this.isVideoShow = false;
        this.videoUrl = '';
    }
    ngAfterViewInit() {
        // let divEle = this.elementRef.nativeElement.querySelectorAll('.demo');
        // console.log(divEle);
    }
}
