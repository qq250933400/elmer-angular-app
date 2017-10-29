import { Component } from '@angular/core';
import { LangComponent } from '../../../../core/lang.component';
// import { icon } from './startResource';

@Component({
    styleUrls: ['./startMenuInfoBar.component.css'],
    templateUrl: './startMenuInfoBar.component.html',
    selector: 'win8-infBar'
})
export class StartMenuInfoBarComponent extends LangComponent {
    loginoutTitle: string = this.message('app.home.win8.loginout');
    logo: string = 'assets/approve.png';
}
