import 'rxjs/add/operator/toPromise';
import { Injectable, OnInit } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { CommonComponent } from './common.component'
import { IExConfig, IExConfigURL } from '../interface/config.interface';
import { IRequestData } from '../interface/http.interface';
@Injectable()
export class CoreService extends CommonComponent {
    baseURL: string = "http://tmall.dmeww.com/prcmedia/";
    serviceURL: IExConfigURL = {};
    private dataTypes = {
        json       : 'application/json, text/javascript, */*; q=0.01',
        xml        : 'text/xml',
        image      : 'image/webp,image/apng,image/*,*/*;q=0.8',
        all        : '*/*'
    };
    constructor(private baseHttp:Http){
        super();
        const mapConfigCallBack = "setConfig";
        this.reloadConfig();
        window[mapConfigCallBack] = ()=>{
            this.reloadConfig();
        };
    }
    reloadConfig():void{
        const key = 'elmer';
        const devConfig = window[key];
        if(devConfig && this.isObject(devConfig)){
            const devObj: IExConfig = devConfig;
            const serviceURL = devObj.debug ? devObj.dev.baseURL : devObj.prod.baseURL;
            this.serviceURL = {
                ...(devObj.debug ? devObj.dev : devObj.prod)
            };
            if(/^(http[s]{0,1}\:\/\/)/i.test(serviceURL)) {
                this.baseURL = serviceURL;
            }else {
                serviceURL && serviceURL.length > 0 && console.error("服务接口请求地址必须是【http://】或【https://】开头！");
            }
        }
    }
    urlEncodeObject(data) {
        const mArr = [];
        for(const key in data) {
            const tmpValue = data[key];
            if(this.isArray(tmpValue) && tmpValue !== null){
                for(const subKey in tmpValue) {
                    const subValue = tmpValue[subKey];
                    if(this.isString(subValue) || this.isNumber(subValue)) {
                        const subData = [key+"[]",encodeURIComponent(subValue)].join('=');
                        mArr.push(subData);
                    }else if(this.isObject(subValue)) {
                        const subData = [key+"[]",this.urlEncodeObject(subValue)].join('=');
                        mArr.push(subData);
                    }
                }
            }else {
                const tmpData = [key, encodeURIComponent(tmpValue)].join('=');
                mArr.push(tmpData);
            }
        }
        return mArr.join('&');
        // return encodeURIComponent(JSON.stringify(data));
    }
    get(data:IRequestData):Promise<object>{
        const url = this.baseURL + data.url;
        const header = new Headers();
        const typeKey = data.dataType.toLowerCase();
        // header.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        header.append("Accept",this.dataTypes[typeKey] || this.dataTypes.all);
        return this.baseHttp.get(url,{
            headers: header
        }).toPromise();
    }
    post(data:IRequestData):Promise<object>{
        const url = this.baseURL + data.url;
        const header = new Headers();
        const typeKey = data.dataType.toLowerCase();
        const submitData = this.isObject(data.data) ? this.urlEncodeObject(data.data) : data.data;
        header.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        header.append("Accept",this.dataTypes[typeKey] || this.dataTypes.all);
        // header.append("Access-Control-Allow-Origin", "*");
        return this.baseHttp.post(url,submitData, {
            headers: header
        }).toPromise();
    }
}