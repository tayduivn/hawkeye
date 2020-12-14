import { environment } from 'src/environments/environment';

export class config {
    static upLoadMaxImgLength: number = 5; //最多上传图片张数
    static maxRenewInitRequest: number = 2; //重新发起请求次数
    static renewInitRequestTime: number = 150000000; //重新发起请求间隔
    static avoidInterception : string[] = [environment.apiUrl + '/task/add_inspection_task_review_summary_pic_video']

}

// TODO 记住页码 （sessionStroge）
