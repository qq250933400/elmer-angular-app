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
                    if(userData.userType == UserType.MediaUser){
                        if(parseInt(userData.status.toString(),10) === 1){
                            this.router.navigate(['prc', 'register']);
                        }else if(parseInt(userData.status.toString(),10) === -1){
                            this.router.navigate(['prc', 'register']);
                        }else if(parseInt(userData.status.toString(),10) === 0){
                            this.router.navigate(['prc', 'status']);
                        }else if(parseInt(userData.status.toString(),10) === -2){
                            return;
                        }else{
                            alert("获取用户身份失败！");
                        }
                    }else{
                        //洋酒爱好者 不做跳转
                        console.log("洋酒爱好者");
                    } 
                } else {
                    window.location.href = this.serviceURLs.loginURL;
                }
            }).catch((err) => {
                this.isLoading = false;
                alert(this.isObject(err) ? err['msg'] : err);
                if(err && err['redirect'] && this.isString(err['redirect'])) {
                    const pathStr = err['redirect'];
                    const pathArr = pathStr.replace(/^\//,'').replace(/\/$/,'').split('/');
                    this.router.navigate(pathArr);
                }
                if(err && err['outlogin']){
                    window.location.href = this.serviceURLs.loginURL;
                }
                console.error("ResponseError:" + err);
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
                if(data['success']){
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
