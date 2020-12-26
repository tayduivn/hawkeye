import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'compareText',
})
export class CompareTextPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        if (typeof value === 'string') {
            return value;
        } else {
            return JSON.parse(value);
        }
    }
}
