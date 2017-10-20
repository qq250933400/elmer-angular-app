import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    title = 'app';
    constructor(private appService: AppService){

    }
    ngOnInit():void{
        this.appService.demo().then((res)=>{
            console.log(res);
        }).catch((err)=>{
            console.log(err);
        });
    }
}
