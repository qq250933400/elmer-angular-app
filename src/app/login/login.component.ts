import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { CoreComponent } from '../../core/core.component';
import { clsUserInfo, clsNewsInfo, UserType } from '../../interface/prc.interface';
// import { userInfo } from 'os';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ["./login.component.css"]
})
export class LoginComponent extends CoreComponent implements AfterViewInit {
    logo = 'assets/prc/logo.png';
    isLoading = false;
    mobilePhone = "";
    password = "";
    tbUserName: HTMLElement;
    tbPassword: HTMLElement;
    constructor(
        private appService:AppService,
        private route:Router,
        private element: ElementRef
    ){
        super();
    }
    ngAfterViewInit():void{
        this.tbUserName = this.element.nativeElement.querySelector(".login_input_area input[type=text]");
        this.tbPassword = this.element.nativeElement.querySelector(".login_input_area input[type=password]");
    }
    handleOnMobileChange(value):void{
        const mobile = event.target['value'];
        this.mobilePhone = mobile;
    }
    handleOnPasswordChange(event):void{
        const password = event.target['value'];
        this.password = password;
    }
    handleOnLogin():void{
        this.isLoading = true;
        if(this.tbUserName){
            this.mobilePhone = this.tbUserName['value'];
        }
        if(this.tbPassword) {
            this.password = this.tbPassword['value'];
        }
        this.appService.login(this.mobilePhone,this.password).then((data)=>{
            this.isLoading = false;
            if(data['success']){
                const UserInfo = this.mapUserInfo(data['data']);
                this.appService.setUserInfo(UserInfo);
                if(UserInfo.userType == UserType.MediaUser && !/wechat/i.test(UserInfo.regType)){
                    if(this.baseConfig && this.baseConfig.loginToActivity){
                        this.route.navigate(["prc", "gift"]);
                    } else {
                        window.location.href = this.appService.baseURL+"index.php?m=Api&c=Wxapi&a=bind_wx";
                    }
                }else {
                    if(this.isNull(data['data']['wx_open_id'])) {
                        window.location.href = this.appService.baseURL+"index.php?m=Api&c=Wxapi&a=bind_wx";
                    }else{
                        if(UserInfo.userType = UserType.MediaUser) {
                            this.route.navigate(['prc', 'news']);
                        }else {
                            this.route.navigate(['prc', 'start']);
                        }
                    }
                }
            }else {
                alert(data['info']);
            }
        }).catch((err)=>{
            this.isLoading = false;
            alert(err['msg']);
        });
    }
    mapUserInfo(userData):clsUserInfo{
        const UserInfo = new clsUserInfo();
        const birthValue = userData['birthday'] ? userData['birthday'].split('-'): null;
        UserInfo.userType = userData['user_type'];
        UserInfo.userName = userData['user_name'];
        UserInfo.userID = userData['user_id'];
        UserInfo.mobilePhone = userData['mobile_phone'];
        UserInfo.province = userData['province'] || '';
        UserInfo.city = userData['city'] || '';
        UserInfo.birthMonth = birthValue ? birthValue[0] : '';
        UserInfo.birthDay = birthValue ? birthValue[1]: '';
        UserInfo.mediaType = userData['media_type'];
        UserInfo.mediaName = userData['media_name'];
        UserInfo.responsible = userData['responsible'];
        UserInfo.wineType = userData['wineTypes'];
        UserInfo.status = userData['status'];
        UserInfo.address = userData['address'];
        UserInfo.level = userData['level'];
        UserInfo.regType = userData['regtype'];
        return UserInfo;
    }
}
