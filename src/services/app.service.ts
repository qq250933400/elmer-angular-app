import 'rxjs/add/operator/toPromise';
import { Injectable, OnInit } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { CoreService } from '../core/service.component';
import { IUserInfo, clsUserInfo } from '../interface/prc.interface';
 
// import { Promise } from 'q';

@Injectable()
export class AppService extends CoreService{
    NewsType = 0;
    NewsTitle = '';
    SearchNewsValue = '';
    constructor(private http: Http, private UserInfo: clsUserInfo) {
        super(http);
    }
    getUserInfomation():Promise<object>{
        return new Promise((resolve, reject)=>{
            this.http.get(`${this.baseURL}index.php?m=Prc&c=Index&a=getuserinfo`)
            .toPromise().then((res)=>{
                try{
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
                            this.UserInfo.address = userData['address'];
                            this.UserInfo.level = userData['level'];
                            this.UserInfo.regType = userData['regtype'];
                            resolve(this.UserInfo);
                        }else {
                            reject({
                                msg: data['info'],
                                ...data
                            });
                        }
                    }else {
                        reject(res.statusText);
                    }
                }catch(e){
                    reject(e.message);
                }
            }).catch((err)=>{
                console.log(err);
                reject(err.message);
            });
        });
    }
    setUserInfo(userData: clsUserInfo): void{
        this.UserInfo = userData;
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
        this.extend(this.UserInfo, data);
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
    getNewsTypes(): Promise<object>{
        return this.http.get(`${this.baseURL}index.php?m=Prc&c=Index&a=gettypes`).toPromise();
    }
    setRouterType(type:number):void{
        this.NewsType = type;
    }
    getRouterType():number{
        return this.NewsType;
    }
    setSearchNewsValue(value:string): void{
        this.SearchNewsValue = value;
    }
    getSearchNewsValue(): string{
        return this.SearchNewsValue;
    }
    getNewsDetail(id: number): Promise<object>{
        return new Promise((resolve,reject)=>{
            this.http.get(`${this.baseURL}index.php?m=Prc&c=News&a=getNews&id=${id}`)
                .toPromise().then((res:Response)=>{
                    if(res.status === 200){
                        resolve(res.json());
                    }else {
                        reject(new Error(res.text()));
                    }
                }).catch((err:Error)=>{
                    reject(new Error(err.message));
                });
        });
    }
    getNewsDownloadInfo(newsID:number):Promise<object>{
        return new Promise((resolve,reject)=>{
            this.http.get(`${this.baseURL}index.php?m=Prc&c=News&a=getNewsDownload&id=${newsID}`)
            .toPromise().then((res:Response)=>{
                if(res.status === 200){
                    resolve(res.json());
                }else {
                    reject(res.statusText);
                }
            }).catch((err:Error)=>{
                reject(err.message);
            });
        });
    }
    sendNewsSourceToEmail(newsIDS: Array<number>, toEmail:string): Promise<object>{
        return new Promise((resove,reject)=>{
            let headers = new Headers(); //其实不表明 json 也可以, ng 默认好像是 json
            headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            headers.append('Accept', 'application/json, text/javascript, */*; q=0.01');
            this.http.post(`${this.baseURL}index.php?m=Prc&c=News&a=sendSourceToEmail`,this.urlEncodeObject({
                news: newsIDS,
                toEmail
            }),{
                headers
            }).toPromise()
            .then((res:Response)=>{
                if(res.status === 200) {
                    resove(res.json());
                }else {
                    reject(res.statusText);
                }
            }).catch((err:ErrorEvent)=>{
                reject(err.message);
            });
        });
    }
    sendMoreInfoEmail(toEmail:string,context: string):Promise<object>{
        return new Promise((resove,reject)=>{
            let headers = new Headers(); //其实不表明 json 也可以, ng 默认好像是 json
            headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            headers.append('Accept', 'application/json, text/javascript, */*; q=0.01');
            this.http.post(`${this.baseURL}index.php?m=Prc&c=News&a=getMoreInfo`,this.urlEncodeObject({
                context,
                toEmail
            }),{
                headers
            }).toPromise()
            .then((res:Response)=>{
                if(res.status === 200) {
                    resove(res.json());
                }else {
                    reject(res.statusText);
                }
            }).catch((err:ErrorEvent)=>{
                reject(err.message);
            });
        });
    }
    sendSMSCode(phone:string): Promise<object>{
        return new Promise((resolve,reject)=>{
            let headers = new Headers(); //其实不表明 json 也可以, ng 默认好像是 json
            headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            headers.append('Accept', 'application/json, text/javascript, */*; q=0.01');
            this.http.post(`${this.baseURL}index.php?m=Prc&c=Index&a=sendSMSCode`,this.urlEncodeObject({
                phone
            }),{headers}).toPromise().then((res:Response)=>{
                if(res.status === 200) {
                    resolve(res.json());
                }else {
                    reject(res.statusText);
                }
            }).catch((err:Error)=>{
                reject(err.message);
            });
        });
    }
    getWrapperNews(locale:String):Promise<object>{
        return new Promise((resolve,reject)=>{
            this.http.get(`${this.baseURL}index.php?m=Prc&c=News&a=wrapperinfo&lang=${locale}`).toPromise()
                .then((res:Response)=>{
                    if(res.status === 200) {
                        resolve(res.json());
                    } else {
                        reject(res.statusText);
                    }
                }).catch((err:Error)=>{
                    reject(err.message);
                });
        });
    }
    sendViewLog(newsID): Promise<object>{
        return new Promise((resolve,reject)=>{
            this.http.get(`${this.baseURL}index.php?m=Prc&c=News&a=viewlog&id=${newsID}`)
                .toPromise()
                .then((res:Response)=>{
                    if(res.status == 200) {
                        resolve(res.json());
                    }else {
                        reject(res.statusText);
                    }
                }).catch((err:ErrorEvent)=>{
                    reject(err.message);
                });
        });
    }
    setNewsType(title):void{
        this.NewsTitle = title;
    }
    getNewsTypeTitle():string{
        return this.NewsTitle;
    }
    choseUserType(type:string): Promise<object>{
        return new Promise((resolve,reject)=>{
            let headers = new Headers(); //其实不表明 json 也可以, ng 默认好像是 json
            headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            headers.append('Accept', 'application/json, text/javascript, */*; q=0.01');
            this.http.post(`${this.baseURL}index.php?m=Prc&c=Index&a=setUserType`,this.urlEncodeObject({
                userType: type
            }),{headers}).toPromise().then((res:Response)=>{
                if(res.status=200) {
                    resolve(res.json());
                }else {
                    reject({msg: res.statusText});
                }
            }).catch((err:ErrorEvent)=>{
                reject({
                    msg:err.message
                });
            });
        });
    }
    setMediaUserType(type:string): Promise<object>{
        return new Promise((resolve,reject)=>{
            let headers = new Headers(); //其实不表明 json 也可以, ng 默认好像是 json
            headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            headers.append('Accept', 'application/json, text/javascript, */*; q=0.01');
            this.http.post(`${this.baseURL}index.php?m=Prc&c=Index&a=setMediaType`,this.urlEncodeObject({
                userType: type
            }),{headers}).toPromise().then((res:Response)=>{
                if(res.status=200) {
                    resolve(res.json());
                }else {
                    reject({msg: res.statusText});
                }
            }).catch((err:ErrorEvent)=>{
                reject({
                    msg:err.message
                });
            });
        });
    }
    login(mobilePhone:string,password:string): Promise<object>{
        return new Promise((resolve,reject)=>{
            let headers = new Headers(); //其实不表明 json 也可以, ng 默认好像是 json
            headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            headers.append('Accept', 'application/json, text/javascript, */*; q=0.01');
            this.http.post(`${this.baseURL}index.php?m=Prc&c=Index&a=login`,this.urlEncodeObject({
                phone:mobilePhone,
                password
            }),{headers}).toPromise().then((res:Response)=>{
                if(res.status=200) {
                    resolve(res.json());
                }else {
                    reject({msg: res.statusText});
                }
            }).catch((err:ErrorEvent)=>{
                reject({
                    msg:err.message
                });
            });
        });
    }
}

