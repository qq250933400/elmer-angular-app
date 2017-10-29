import { Component } from '@angular/core';
import { LangComponent } from '../../core/lang.component';
@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.css']
})
export class StatusComponent extends LangComponent {
    logo = "assets/prc/logo.png";
    statusText: string = this.getMessage("statusText");
    tipText: string = this.getMessage("tipText");
    scanTip: string = this.getMessage("scanTip");
    qrImage = "assets/prc/qrcode.jpg";
    getMessage(key:string):string {
        return this.message('prc.status.' + key);
    }
}
