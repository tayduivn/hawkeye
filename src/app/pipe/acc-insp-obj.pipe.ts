import { Pipe, PipeTransform } from '@angular/core';
import { accessOfTaskAndFac } from 'src/app/pages/task-detail/task-detail.page';

@Pipe({
    name: 'accInspObj',
})
export class AccInspObjPipe implements PipeTransform {
    transform(value: Array<accessOfTaskAndFac>, args?: any): Array<accessOfTaskAndFac> {
        let some: Array<accessOfTaskAndFac> = JSON.parse(JSON.stringify(value));
        some.forEach((element, i) => {
            element.data.forEach((acc, j) => {
                for (let key in acc) {
                    if (key == 'AccessoryCode' || key == 'ProductCode') {
                        acc[key] = acc[key];
                    } else acc[key] = '';
                }
            });
        });
        return some;
    }
}
