import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'parseNbsp',
})
export class ParseNbspPipe implements PipeTransform {
    transform(value: string, args?: any): any {
        value = value.replace(/&nbsp;/g, '━━');
        return value;
    }
}
