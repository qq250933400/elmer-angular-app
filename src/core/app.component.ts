import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LangComponent } from './lang.component';
@Component({
    selector: 'app-root',
    templateUrl: './route.layout.html',
    styleUrls: ['../styles/app.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent extends LangComponent implements OnInit {
    title = 'app';
    appTitle: string = this.message('app_title');
    ngOnInit(): void {
        if (this.appTitle && this.appTitle.length > 0) {
            document.title = this.appTitle;
        }
        if (!/iPhone|iPad|Android/.test(window.navigator.userAgent.toString())) {
            document.body.setAttribute('style', "width:375px;height:667px;margin:0 auto;background:#eee;overflow:auto;");
        }
    }
}
