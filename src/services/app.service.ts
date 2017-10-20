import 'rxjs/add/operator/toPromise';
import { Injectable, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Injectable()
export class AppService {
    constructor(private http: Http) {

    }
    demo():Promise<object>{
        return this.http.get('http://182.61.37.81/index.php?a=demo').toPromise();
    }
}

