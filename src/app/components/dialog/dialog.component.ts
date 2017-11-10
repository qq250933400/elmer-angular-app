import { Component, ElementRef,AfterViewInit, OnDestroy, Input, Output, EventEmitter, OnChanges  } from '@angular/core';
import { CoreComponent} from '../../../core/core.component';
@Component({
    selector: 'app-dialog',
    styleUrls: ['./dialog.component.css'],
    template: `<div class="dialog" (click)="handleMaskClick()">
        <div class="dialog_form loadAnimation" (click)="handleFormClick($event)">
            <div class="dialog_header"><img src="{{logo}}" /><a (click)="closeWindow()" href="javascript:void(0)"><img src="assets/prc/close.png" /></a></div>
            <div class="dialog_content"><ng-content></ng-content></div>
            <div class="dialog_bottom" *ngIf="isConfirmVisible"><button *ngIf="confirmVisible" (click)="confirmClick()">{{btnTitle}}</button></div>
        </div>
    </div>`
})
export class DialogComponent extends CoreComponent implements AfterViewInit, OnDestroy, OnChanges {
    form: Element;
    mask: Element;
    closeAnimation = false;
    confirmAnimation = false;
    isConfirmVisible = true;
    @Input()confirmVisible: boolean = true;
    @Input()cancleConfirmClose: boolean = false;
    @Input()btnTitle: string = "确认发送";
    @Output()close: EventEmitter<string> = new EventEmitter<string>();
    @Output()confirm: EventEmitter<string> = new EventEmitter<string>();
    @Input()logo = "assets/prc/download_white.png";
    constructor(private element: ElementRef){
        super();
        this.closeAnimationEnd = this.closeAnimationEnd.bind(this);
    }
    ngOnDestroy():void{
        this.removeEvent(window,'resize',this.windowResize);
        this.removeAnimationEnd(this.form,this.closeAnimationEnd);
    }
    ngAfterViewInit():void{
        this.form = this.element.nativeElement.querySelector(".dialog_form");
        this.mask = this.element.nativeElement.querySelector(".dialog");
        this.addEvent(window,"resize",this.windowResize);
        this.animationEnd(this.form,this.closeAnimationEnd);
        this.windowResize();
    }
    ngOnChanges(nv):void{
        if(nv.confirmVisible) {
            const newValue = nv.confirmVisible['currentValue'];
            const nValue = newValue === 'true' || newValue === true ? true : false;
            this.isConfirmVisible = nValue;
        }
    }
    windowResize():void{
        if(this.form && this.mask){
            const height = this.mask.clientHeight;
            const cHeight = this.form.clientHeight;
            const top = (height - cHeight)/2;
            this.setCss(this.form,"margin-top",`${top}px`);
        }
    }
    closeWindow():void{
        this.closeAnimation = true;
        this.confirmAnimation = false;
        this.form.classList.add("closeAnimation");
    }
    closeAnimationEnd():void{
        if(this.closeAnimation){
            this.close.emit('cancel');
        }else if(this.confirmAnimation) {
            this.confirm.emit("ok");
        }
        this.form.classList.remove("closeAnimation");
        this.form.classList.remove("loadAnimation");
    }
    confirmClick():void{
        if(!this.cancleConfirmClose){
            this.closeAnimation = false;
            this.confirmAnimation = true;
            this.form.classList.add("closeAnimation");
        }else {
            this.confirm.emit("ok");
        }
    }
    handleFormClick(event:Event): void{
        event.cancelBubble = true;
    }
    handleMaskClick():void{
        this.closeWindow();
    }
}