import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterText',
})
export class FilterTextPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        if (!value || value == undefined) value = '';
        return value;
    }
}
