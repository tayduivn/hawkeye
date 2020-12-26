import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'analysis',
})
export class AnalysisPipe implements PipeTransform {
    transform(value: string, args?: any): any {
        return value.replace(/&nbsp;/g, '——');
    }
}
