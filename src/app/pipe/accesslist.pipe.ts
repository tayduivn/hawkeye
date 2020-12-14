import { Pipe, PipeTransform } from '@angular/core';
import { accessOfTaskAndFac, access } from '../pages/task-detail/task-detail.page';

@Pipe({
    name: 'accesslist',
})
export class AccesslistPipe implements PipeTransform {
    transform(value: Array<accessOfTaskAndFac>, args?: any): Array<access> {
        let accessList = [];
        value.forEach((accessOfTaskAndFac: accessOfTaskAndFac) => {
            let contract_id = accessOfTaskAndFac.contract_id;
            accessOfTaskAndFac.data.forEach((access: access) => {
                access.contract_id = contract_id;
                accessList.push(access);
            });
        });

        return accessList;
    }
}
