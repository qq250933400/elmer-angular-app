import { CoreService } from '../../core/service.component';
import { Response } from '@angular/http';
import { resolve } from 'url';
// import { Promise, reject } from 'q';
export class GiftService extends CoreService {
    AcceptChoseGift(data): Promise<object>{
        return new Promise((reslove,reject)=>{
            this.post({
                url:"index.php?m=Prc&c=Activity&a=newyearGift",
                dataType:"json",
                data: data
            }).then((data: Response)=>{
                if(data.status === 200){
                    const result = data.json();
                    if(result['success']) {
                        reslove(result);
                    }else {
                        reject({
                            msg: result['info'],
                            data: result
                        }); 
                    }
                }else {
                    reject({
                        msg: data.statusText
                    });
                }
            })
            .catch((err:Error)=>{
                reject({
                    msg: err.message
                });
            });
        });
    }
    ConfirmInfoChoseGift(data): Promise<object>{
        return new Promise((reslove,reject)=>{
            this.post({
                url:"index.php?m=Prc&c=Activity&a=updateInfo",
                dataType:"json",
                data: data
            }).then((data: Response)=>{
                if(data.status === 200){
                    const result = data.json();
                    if(result['success']) {
                        reslove(result);
                    }else {
                        reject({
                            msg: result['info']
                        }); 
                    }
                }else {
                    reject({
                        msg: data.statusText
                    });
                }
            })
            .catch((err:Error)=>{
                reject({
                    msg: err.message
                });
            });
        });
    }
    getActivityInfo(): Promise<object>{
        return new Promise((reslove,reject)=>{
            this.get({
                url:"index.php?m=Prc&c=Activity&a=getActivityInfo",
                dataType:"json"
            }).then((data: Response)=>{
                if(data.status === 200){
                    const result = data.json();
                    if(result['success']) {
                        reslove(result);
                    }else {
                        reject({
                            msg: result['info']
                        }); 
                    }
                }else {
                    reject({
                        msg: data.statusText
                    });
                }
            })
            .catch((err:Error)=>{
                reject({
                    msg: err.message
                });
            });
        });
    }
}