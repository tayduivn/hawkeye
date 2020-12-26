import { Pipe, PipeTransform } from '@angular/core';
import { taskInfo } from '../services/task.service';

@Pipe({
    name: 'taskList',
})
export class TaskListPipe implements PipeTransform {
    transform(value: Array<taskInfo>, args?: any): Array<taskInfo> {
        let returnValue: Array<taskInfo> = [];
        for (var i = 0; i < value.length; i++) {
            if (value[i].factory && value[i].factory.length) {
                value[i].choiceFactoryId = value[i].factory[0].id;
            }
            returnValue.push(value[i]);
        }
        debugger;
        return returnValue;
    }
}
