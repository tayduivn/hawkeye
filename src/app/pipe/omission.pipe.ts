import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'omission',
})
export class OmissionPipe implements PipeTransform {
    transform(value: any, num: number, args?: any): any {
        if (value.length >= num) {
            return value.substring(0, num) + '...';
        } else return value;
    }
}
