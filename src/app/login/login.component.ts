import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ["./login.component.css"]
})
export class LoginComponent {
    logo = 'assets/prc/logo.png';
    isLoading = false;
    mobilePhone = "";
    password = "";
    constructor(private appService:AppService){

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
        this.appService.login(this.mobilePhone,this.password).then((data)=>{
            this.isLoading = false;
            if(data['success']){
                window.location.href = this.appService.baseURL+"index.php?m=Api&c=Wxapi&a=bind_wx";
            }else {
                alert(data['info']);
            }
        }).catch((err)=>{
            this.isLoading = false;
            alert(err['msg']);
        });
    }
}
