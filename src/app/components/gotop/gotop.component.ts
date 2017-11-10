import { Component, Input, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { LangComponent } from '../../../core/lang.component';
@Component({
    selector:"app-gotop",
    styleUrls:['./gotop.component.css'],
    template:`<div class="gotop" *ngIf="visible"><div class="gotopShadow" (click)="gotopClick()">
        <div [(class.gotoAlignRight)]="alignRight"><img src="{{logo}}"/><span>{{title}}</span></div>
        <ng-content></ng-content>
    </div></div>`
})
export class GotopComponent extends LangComponent implements AfterViewInit, OnChanges {
    title: string = this.message("gotop");
    logo = "assets/prc/gotop.png";
    visible: boolean = false;
    isGotop = false;
    @Input()alignRight: boolean = false;
    @Input()wapper: Element;
    @Input()WapperID: string;
    @Input()display: boolean = false;
    constructor(private ele:ElementRef){
        super();
        this.wapperScroll= this.wapperScroll.bind(this);
    }
    ngAfterViewInit():void{
        const id = /^[a-zA-Z]*/.test(this.WapperID) ? "#" + this.WapperID : '';
        this.wapper = document.querySelector(id);
        this.addEvent(this.wapper,"scroll",this.wapperScroll);
    }
    ngOnChanges(evt):void{
        if(evt.alignRight) {
            const value = evt.alignRight.currentValue == 'true' ? true : false;
            this.alignRight = value;
        }
        if (evt.display){
            const value = evt.display.currentValue == 'true' ? true : false;
            this.display = value;
            if(value){
                this.visible = true;
            }else {
                if(this.wapper && this.wapper.scrollTop<=100){
                    this.visible = false;
                }
            }
        }
        
    }
    wapperScroll(event):void{
        if(!this.display){
            if(this.wapper.scrollTop>100){
                this.visible = true;
            }else {
                this.visible = false;
            }
        }else {
            this.visible = true;
        }
    }
    gotopClick():void{
        if(!this.isGotop){
            let speed = 10;
            let curTime = 0;
            const animation=()=>{
                if(this.wapper.scrollTop>0){
                    curTime++;
                    this.wapper.scrollTop = this.wapper.scrollTop - speed;
                    setTimeout(animation,1);
                }else {
                    this.isGotop = false;
                    return;
                }
            };
            animation();
            this.isGotop = true;
        }
    }
}