import { Component } from '@angular/core';
import { LangComponent } from '../../core/lang.component';
@Component({
    selector: 'app-finish',
    templateUrl: './finish.component.html',
    styleUrls: ['./finish.component.css']
})
export class FinishComponent extends LangComponent {
    logo = "assets/prc/logo.png";
    tipText: string = this.getMessage("tipText");
    qrImage = "assets/prc/qrcode.jpg";
    getMessage(key:string):string {
        return this.message('prc.finish.' + key);
    }
}