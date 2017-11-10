import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-dbtn',
    styleUrls: ['./dbtn.component.css'],
    template: '<div class="dbtn"><div><ng-content></ng-content></div></div>',
    encapsulation: ViewEncapsulation.None
})
export class DBtnComponent{
    
}