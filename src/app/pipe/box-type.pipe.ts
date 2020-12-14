import { CompareItem } from './../pages/data-compare-detail/data-compare-detail.component';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'boxType',
})
export class BoxTypePipe implements PipeTransform {
    transform(value: CompareItem[], arg: 'outer' | 'inner' | 'test' | 'inspection_require'): any {
        if (value) {
            return value.filter((elem) => elem.box_type == arg);
        }
    }
}
