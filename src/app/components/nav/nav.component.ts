import { Component, OnInit, Input, EventEmitter,Output } from '@angular/core';
import { Router } from '@angular/router';
import { LangComponent } from '../../../core/lang.component';
import { AppService } from '../../../services/app.service';
@Component({
    selector: "app-nav",
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent extends LangComponent implements OnInit {
    logo = "assets/prc/newlogo.png";
    downloadIcon = "assets/prc/download.png";
    userIcon = "assets/prc/userinfo.png";
    menuIcon = "assets/prc/menu.png";
    showMenu = false;
    @Input()noMenuBar = false;
    @Input()whiteBackground = true;
    menuData: object[];
    langTitle: string = this.local === 'en' ? "中" : "EN";
    @Output()
    downloadClick: EventEmitter<boolean> = new EventEmitter(true);
    @Input()
    navID: string;
    searchValue: string = '';
    constructor(private appService: AppService,private router:Router){
        super();
        document.body.style.overflow="hidden";
    }
    ngOnInit():void{
        this.appService.getNewsTypes().then((res: Response)=>{
            if(res.status === 200){
                const data = res.json();
                if(data['success']){
                    const listData: object[] = data['data'];
                    listData.map((item,key)=>{
                        const mStr = this.local === 'zh' ? item['value1'] : item['value2'];
                        listData[key]['value1'] = mStr;
                    });
                    this.menuData = [
                        { value_id: 0, value1: this.message('prc.latestnews') },
                        ...listData
                    ];
                }
            }
        }).catch((err:Error)=>{
            console.log(err.message);
        });
        this.searchValue = window['decodeURIComponent'](this.appService.getSearchNewsValue());
    }
    menuClick():void{
        this.showMenu = !this.showMenu;
    }
    handleDownloadClick(): void{
        // this.noMenuBar = !this.noMenuBar;
        if(this.downloadClick){
            this.downloadClick.emit(true);
        }
    }
    navClick(event: Event):void{
        event.preventDefault();
        event.stopPropagation();
        event.cancelBubble = true;
    }
    areaClick(event):void{
        this.showMenu = false;
    }
    menuItemClick(menuItem): void {
        const newsID = menuItem['value_id'];
        const title = this.local === 'en' ? menuItem['value2'] : menuItem['value1'];
        this.appService.setRouterType(newsID);
        this.appService.setNewsType(title);
        this.router.navigateByUrl(`prc/news/${newsID}`);
        this.showMenu = false;
    }
    onKeyPressHandle(event:KeyboardEvent): void{
        if(event.keyCode === 13) {
            const newType = this.appService.getRouterType();
            const value = event.target['value']||'';
            const encodeCallBack = window['encodeURIComponent'];
            const eValue = encodeCallBack(value);
            this.searchValue = value;
            this.router.navigateByUrl(`prc/news/${newType}/${eValue}`);
            this.showMenu = false;
        }
    }
    handleOnLangChange():void{
        const newLange = this.local === 'en' ? 'zh' : 'en';
        this.setLanguage(newLange, true);
    }
    handleOnSearchClick(event):void{
        const sender = event.target.parentElement.querySelector("input");
        const newType = this.appService.getRouterType();
        const value = sender.value||'';
        const encodeCallBack = window['encodeURIComponent'];
        const eValue = encodeCallBack(value);
        this.searchValue = value;
        this.router.navigateByUrl(`prc/news/${newType}/${eValue}`);
        this.showMenu = false;
    }
}
