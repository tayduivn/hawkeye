import { NotifyComponent } from './templates/notify/notify.component';
import { GlobalModalComponent } from './component/global-modal/global-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkuDescPopupComponent } from './component/sku-desc-popup/sku-desc-popup.component';
import { ConfirmedPopupBoxComponent } from './component/confirmed-popupbox/confirmed-popupbox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DefaultInterceptor } from './services/interceptor.service';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ShareModule } from './share/share.module';
import { CustomPopupComponent } from './component/custom-popup/custom-popup.component';
import { DistribSeeOrderDetailComponent } from './pages/distrib-see-order-detail/distrib-see-order-detail.component';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';

/** 配置 angular i18n **/
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { SimpleReuseStrategy } from './layout/layout/router';
import { confirmedInspectComponent } from './component/confirmed-inspect/confirmed-inspect.component';
import { InspectSettingBoxComponent } from './component/inspect-setting-box/inspect-setting-box.component';
import { EditTaskComponent } from './component/edit-task/edit-task.component';
registerLocaleData(zh);

@NgModule({
    declarations: [
        AppComponent,
        CustomPopupComponent,
        DistribSeeOrderDetailComponent,
        confirmedInspectComponent,
        SkuDescPopupComponent,
        InspectSettingBoxComponent,
        EditTaskComponent,
        GlobalModalComponent,
        NotifyComponent,
    ],
    entryComponents: [
        CustomPopupComponent,
        SkuDescPopupComponent,
        DistribSeeOrderDetailComponent,
        ConfirmedPopupBoxComponent,
        confirmedInspectComponent,
        InspectSettingBoxComponent,
        EditTaskComponent,
        GlobalModalComponent,
        NotifyComponent,
    ],
    imports: [
        NgZorroAntdModule,
        BrowserModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        ShareModule.forRoot(),
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
        { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: NZ_I18N, useValue: zh_CN },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
