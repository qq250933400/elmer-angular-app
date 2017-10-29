import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { ViewEncapsulation } from "@angular/core";
import { LangComponent } from '../../core/lang.component';
import { AppService } from '../../services/app.service';
@Component({
    selector: 'app-start',
    templateUrl: './start.component.html',
    styleUrls: [
        './start.component.css'
    ]
})
export class StartComponent extends LangComponent implements OnInit {
    logo = 'assets/prc/logo.png';
    tipText: string = this.message('prc.start.tipText');
    mediaTypeStr: string = this.getMessage('mediaType');
    wineLoversTypeStr: string = this.getMessage('wineLovers');
    isLoading: boolean = false;
    constructor(private appService: AppService, private router: Router) {
        super();
    }
    ngOnInit(): void {
        this.isLoading = true;
        this.appService.getUserInfomation()
            .then(() => {
                this.isLoading = false;
                const userData = this.appService.getUserInfo();
                if (userData.userID > 0) {
                    if(parseInt(userData.status.toString(),10) === 1) {
                        this.router.navigate(['prc', 'register']);
                    } else {
                        this.router.navigate(['prc', 'status']);
                    }
                }
            }).catch((err:ErrorEvent) => {
                this.isLoading = false;
                console.error("ResponseError:" + err.message);
            });
    }
    getMessage(key: string): string {
        return this.message(`prc.start.${key}`);
    }
    onMediaTypeClick(): void {
        this.appService.setUserType('MediaUser');
    }
    onWineLoverClick(): void {
        this.appService.setUserType('WineLover');
    }
}
