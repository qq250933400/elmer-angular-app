import { Component } from '@angular/core';
import { LangComponent } from '../../index';
@Component({
    selector: 'app-loading',
    template: '<div class="app-loading"><div><div><img src="{{image}}" /><span>{{title}}</span></div></div></div>',
    styleUrls: ['./loading.component.css']
})
export class LoadingComponent extends LangComponent {
    image = 'assets/prc/2.gif';
    title: string = this.message('loading') || 'Loading';
}
