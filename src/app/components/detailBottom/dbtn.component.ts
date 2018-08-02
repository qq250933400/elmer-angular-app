import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-dbtn',
    styleUrls: ['./dbtn.component.css'],
    template: '<div><div class="dbtnPlaceHolder"></div><div class="dbtn"><ng-content></ng-content></div></div>',
    encapsulation: ViewEncapsulation.None
})
export class DBtnComponent{
    
}