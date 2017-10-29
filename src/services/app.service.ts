import 'rxjs/add/operator/toPromise';
import { Injectable, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { CoreComponent } from '../core/core.component';
import { IUserInfo, clsUserInfo } from '../interface/prc.interface';

@Injectable()
export class AppService{
    // UserInfo: IUserInfo = new clsUserInfo();
    baseURL: string = "http://localhost/prc/";
    constructor(private http: Http, private UserInfo: clsUserInfo) {
    }
    getUserInfomation():Promise<object>{
        return new Promise((resolve, reject)=>{
            this.http.get(`${this.baseURL}index.php?m=Prc&c=Index&a=getuserinfo`)
            .toPromise().then((res)=>{
                if(res.status === 200){
                    const data = res.json();
                    if (data['success']){
                        const userData = data['data'];
                        const birthValue = userData['birthday'] ? userData['birthday'].split('-'): null;
                        this.UserInfo.userType = userData['user_type'];
                        this.UserInfo.userName = userData['user_name'];
                        this.UserInfo.userID = userData['user_id'];
                        this.UserInfo.mobilePhone = userData['mobile_phone'];
                        this.UserInfo.province = userData['province'] || '';
                        this.UserInfo.city = userData['city'] || '';
                        this.UserInfo.birthMonth = birthValue ? birthValue[0] : '';
                        this.UserInfo.birthDay = birthValue ? birthValue[1]: '';
                        this.UserInfo.mediaType = userData['media_type'];
                        this.UserInfo.mediaName = userData['media_name'];
                        this.UserInfo.responsible = userData['responsible'];
                        this.UserInfo.wineType = userData['wineTypes'];
                        this.UserInfo.status = userData['status'];
                    }else {
                        alert(data['info']);
                    }
                }
                resolve(res);
            }).catch((err)=>{
                reject(err);
            });
        });
    }
    setUserType(type: number|string): void{
        this.UserInfo.userType = type;
    }
    demo(): Promise<object> {
        return this.http.get('http://182.61.37.81/index.php?a=demo').toPromise();
    }
    getUserInfo(): clsUserInfo {
        return this.UserInfo;
    }
    getProvince():Promise<object>{
        return this.http.get(`${this.baseURL}index.php?m=Prc&c=Index&a=getProvince`).toPromise();
    }
    getCity(ProvinceCode:string): Promise<object>{
        return this.http.get(`${this.baseURL}index.php?m=Prc&c=Index&a=getCity&proCode=${ProvinceCode}`).toPromise();
    }
    getBaseList():Promise<object>{
        return this.http.get(`${this.baseURL}index.php?m=Prc&c=Index&a=getBaseList`).toPromise();
    }
    updateUserInfo(data): Promise<object>{
        const core = new CoreComponent();
        core.extend(this.UserInfo, data);
        const url = `${this.baseURL}index.php?m=Prc&c=Index&a=editinfo`;
        let headers = new Headers(); //其实不表明 json 也可以, ng 默认好像是 json
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        headers.append('Accept', 'application/json, text/javascript, */*; q=0.01');
        const submitData = this.urlEncodeObject(this.UserInfo);
        return this.http.post(
            url,
            submitData,
            { headers }
        ).toPromise();
    }
    urlEncodeObject(data) {
        const mArr = [];
        for(const key in data) {
            const tmpValue = data[key];
            const tmpData = [key, encodeURIComponent(tmpValue)].join('=');
            mArr.push(tmpData);
        }
        return mArr.join('&');
    }
    getNewsTypes(): Promise<object>{
        return this.http.get(`${this.baseURL}index.php?m=Prc&c=Index&a=gettypes`).toPromise();
    }
}

