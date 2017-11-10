import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AppService } from '../../services/app.service';
@Injectable()
export class NewsService{
    listPageSize = 10;
    searchNewsType = 0;
    searchValue: string = '';
    constructor(private http:Http,private appService: AppService){

    }
    setNewsType(type:number): void{
        this.searchNewsType = type;
    }
    setNewsSearch(value: string): void{
        const encodeCallBack =window['encodeURIComponent'];
        this.searchValue = encodeCallBack ? encodeCallBack(value||''): value;
    }
    getNewsList(StartPage):Promise<object>{
        const gPage = StartPage>=0 ? StartPage : 0;
        let url = `${this.appService.baseURL}index.php?m=Prc&c=News&a=getNewsList&page=${gPage}&psize=${this.listPageSize}`;
        url += `&newstype=${this.searchNewsType}&search=${this.searchValue}`;
        return new Promise((resolve,reject)=>{
            this.http.get(url).toPromise().then((res:Response)=>{
                if(res.status==200){
                    resolve(res.json());
                }else {
                    reject(res.statusText);
                }
            }).catch((err:Error)=>{
                reject(err.message);
            });
        });
    }
}