import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
// import { ViewEncapsulation } from "@angular/core";
import { LangComponent } from '../../core/lang.component';
import { AppService } from '../../services/app.service';
import { UserType } from '../../interface/prc.interface';
@Component({
    selector: 'app-start',
    templateUrl: './start.component.html',
    styleUrls: [
        './start.component.css'
    ]
})
export class StartComponent extends LangComponent implements OnInit, OnChanges {
    logo = 'assets/prc/logo.png';
    tipText: string = this.message('prc.start.tipText');
    mediaTypeStr: string = this.getMessage('mediaType');
    wineLoversTypeStr: string = this.getMessage('wineLovers');
    isLoading: boolean = false;
    constructor(private appService: AppService, private router: Router) {
        super();
    }
    ngOnChanges(evt):void{
        console.log(evt);
    }
    ngOnInit(): void {
        this.isLoading = true;
        this.appService.getUserInfomation()
            .then(() => {
                this.isLoading = false;
                const userData = this.appService.getUserInfo();
                if (userData.userID > 0) {
                    // alert(userData.userType);return;
                    if(parseInt(userData.status.toString(),10) === 1  && userData.userType == UserType.MediaUser) {
                        this.router.navigate(['prc', 'register']);
                    } else if(parseInt(userData.status.toString(),10) !== 1 && userData.userType == UserType.MediaUser) {
                        this.router.navigate(['prc', 'status']);
                    } else if(userData.userType == UserType.WineLover) {
                        this.router.navigate(['prc', 'finish']);
                    }
                } else {
                    window.location.href = this.appService.baseURL + "index.php?m=Prc&c=Index&a=index";
                }
            }).catch((err) => {
                this.isLoading = false;
                alert(err['msg']);
                if(err['data'] && err['data']['outlogin']){
                     window.location.href = this.appService.baseURL + "index.php?m=Prc&c=Index&a=index";
                }
                console.error("ResponseError:" + err, this.appService.getUserInfo());
            });
    }
    getMessage(key: string): string {
        return this.message(`prc.start.${key}`);
    }
    onMediaTypeClick(): void {
        this.isLoading = true;
        this.appService.setUserType(UserType.MediaUser);
        this.appService.setMediaUserType(UserType.MediaUser)
            .then((data)=>{
                this.isLoading = false;
                if(data['success']) {
                    this.router.navigateByUrl("prc/register");
                }else {
                    alert(data['info']);
                }
            }).catch((err)=>{
                this.isLoading = false;
                alert(err.msg);
            });
    }
    onWineLoverClick(): void {
        this.appService.setUserType(UserType.WineLover);
        this.isLoading = true;
        this.appService.choseUserType(UserType.WineLover).then((data)=>{
            this.isLoading = false;
            if(data['success']) {
                this.router.navigateByUrl("prc/finish");
            }else {
                alert(data['info']);
            }
        }).catch((err)=>{
            this.isLoading = false;
            alert(err.msg);
        });
    }
}
