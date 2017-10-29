import { Component, OnInit } from '@angular/core';
import { LangComponent } from '../../../core/lang.component';
import { AppService } from '../../../services/app.service';
@Component({
    selector: "app-nav",
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
    logo = "assets/prc/newlogo.png";
    downloadIcon = "assets/prc/download.png";
    userIcon = "assets/prc/userinfo.png";
    menuIcon = "assets/prc/menu.png";
    showMenu = false;
    noMenuBar = false;
    menuData: object[];
    constructor(private appService: AppService){

    }
    ngOnInit():void{
        this.appService.getNewsTypes().then((res: Response)=>{
            if(res.status === 200){
                const data = res.json();
                if(data['success']){
                    this.menuData = data['data'];
                }
            }
        });
    }
    menuClick():void{
        this.showMenu = !this.showMenu;
        console.log(this.showMenu);
    }
    downloadClick(): void{
        this.noMenuBar = !this.noMenuBar;
    }
    navClick(event: Event):void{
        event.preventDefault();
        event.stopPropagation();
        event.cancelBubble = true;
    }
    areaClick(event):void{
        this.showMenu = false;
    }
}
