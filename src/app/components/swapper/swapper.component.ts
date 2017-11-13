import { Component, ViewEncapsulation, Input, AfterViewInit, ElementRef, OnChanges, Output, EventEmitter } from '@angular/core';
import { LangComponent } from '../../../core/lang.component';
import { ISwapper, clsSwappe } from '../../../interface/prc.interface';
@Component({
    selector: "app-swapper",
    templateUrl: './swapper.component.html',
    styleUrls: ['./swapper.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SwapperComponent extends LangComponent implements AfterViewInit, OnChanges{
    id: string = new Date().getTime().toString() + (Math.random()*1000+1000).toFixed(0).toString();
    sender: HTMLElement;
    itemPanel: HTMLElement;
    ImageList: HTMLElement;
    @Input()data: clsSwappe[] = new Array<clsSwappe>();
    @Input()width = 'auto';
    @Input()height = 'auto';
    @Input()interval = 200;
    @Input()fixSize = false;
    @Output()onItemClick: EventEmitter<object> = new EventEmitter<object>();
    timeOut = 3;
    currentIndex = 0;
    isSupportCss3 = false;
    timeCount = false;
    isRender = true;
    animation = false;
    isAnimation = false;
    isPressed = false;
    mouseIn = false;
    mouseX = 0;
    mouseY = 0;
    pressX = 0;
    pressY = 0;
    pressTime = 0;
    knowmore = this.message("prc.knowMore");
    constructor(private ele:ElementRef){
        super();
        this.isSupportCss3 = this.supportCss3("transform");
        this.touchMove = this.touchMove.bind(this);
        this.touchStart = this.touchStart.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
    }
    ngOnChanges():void{
        if(this.data.length<2 && this.data.length>0){
            const cData = this.data[0];
            this.data.push({
                title: cData.title,
                imageUrl: cData.imageUrl,
                index: 1
            });
        }
        this.data.map((item,key)=>{
            this.data[key].index = key;
        });
    }
    ngAfterViewInit():void{
        const images = this.ele.nativeElement.querySelector("#imgPanel"+this.id);
        this.ImageList = images;
        this.sender = this.ele.nativeElement.querySelector(".CarouselFigure");
        this.itemPanel = this.ele.nativeElement.querySelector(".CarouselFigure_Items");
        this.addEvent(this.ImageList,"touchmove",this.touchMove);
        this.addEvent(this.ImageList,"touchend",this.touchEnd);
        this.addEvent(this.ImageList,"touchstart",this.touchStart);
        this.initImageItemPosition();
        this.isRender = true;
        this.timeCount = true;
        this.timeTick();
    }
    timeTick () {
        const timeOut = this.timeOut;
        let curTime = 0;
        const next = () => {
            const { currentIndex } = this;
            const data = this.data;
            const nextIndex = currentIndex < data.length - 1 ? currentIndex + 1 : 0;
            this.toNextItem(nextIndex, true);
        };
        const tim = () => {
            if (this.timeCount && this.isRender) {
                curTime++;
                if (curTime >= timeOut) {
                    this.timeCount = false;
                    curTime = 0;
                    next();
                }
            } else {
                curTime = 0;
            }
            setTimeout(tim, 1000);
        };
        tim();
    }
    initImageItemPosition () {
        if (this.ImageList) {
            const { currentIndex } = this;
            for (let i = 0; i < this.ImageList.children.length; i++) {
                const tmpItem = this.ImageList.children[i];
                if (i !== currentIndex) {
                    if (this.isSupportCss3) {
                        this.setCss3(tmpItem, 'transform', 'translateX(100%)');
                    } else {
                        this.setCss3(tmpItem, 'left', '100%');
                    }
                } else {
                    if (this.isSupportCss3) {
                        this.setCss3(tmpItem, 'transform', 'translateX(0%)');
                    } else {
                        this.setCss3(tmpItem, 'left', '0%)');
                    }
                }
            }
            const preImage = this.getPreImage();
            const nexImage = this.getNextImage();
            this.setAttr(preImage,'data-left',-100);
            this.setAttr(nexImage,'data-left',100);
            this.setAttr(this.ImageList.children[this.currentIndex],'data-left',0);
        }
    }
    setImageContainerSize () {
        if (this.ImageList) {
            let initHeight = 0;
            for(let key=0;key<this.ImageList.children.length;key++){
                const image = this.ImageList.children[key];
                const tmpImage = image.querySelectorAll('img')[0];
                const tmpHeight = tmpImage ? tmpImage.clientHeight : image.clientHeight;
                initHeight = initHeight < tmpHeight ? tmpHeight : initHeight;
            }
            if (initHeight > 0) {
                const heightStyle = `height:${initHeight}px;`;
                this.ImageList.setAttribute('style',heightStyle);
                if(this.sender)this.sender.setAttribute('style',heightStyle);
                if(this.itemPanel)this.itemPanel.setAttribute('style',heightStyle);
            }
            this.initImageItemPosition();
        }
    }
    handleOnFocusClick(){
        console.log('focusBarClick');
    }
    toNextItem (index, isToLeft) {
        if (!this.isAnimation && this.isRender) {
            this.timeCount = false;
            if (isToLeft) {
                // before animation,set default position
                if (this.isSupportCss3) {
                    this.setCss3(this.ImageList.children[index], 'transform', 'translateX(100%)');
                } else {
                    this.setCss3(this.ImageList.children[index], 'left', '100%');
                }
                // start transform animation
                let curTime = 0;
                const { currentIndex, interval } = this;
                const animation = () => {
                    if (curTime < interval) {
                        const orignPercent = curTime / interval;
                        const percent = orignPercent * 100;
                        const toPercent = 100 - percent;
                        this.setAttr(this.ImageList.children[index],"data-left",toPercent);
                        this.setAttr(this.ImageList.children[currentIndex],'data-left',percent);
                        if (this.isSupportCss3) {
                            this.setCss3(this.ImageList.children[index], 'transform', `translateX(${toPercent}%)`);
                            this.setCss3(this.ImageList.children[currentIndex], 'transform', `translateX(-${percent}%)`);
                        } else {
                            this.setCss3(this.ImageList.children[index], 'left', `${toPercent}%`);
                            this.setCss3(this.ImageList.children[currentIndex], 'left', `-${percent}%`);
                        }
                        curTime++;
                        setTimeout(animation, 1);
                    } else {
                        this.animation = false;
                        this.currentIndex = index;
                        this.timeCount = true;
                        this.setAttr(this.ImageList.children[index],"data-left",0);
                        this.setAttr(this.ImageList.children[currentIndex],'data-left',-100);
                        if (this.isSupportCss3) {
                            this.setCss3(this.ImageList.children[index], 'transform', 'translateX(0%)');
                            this.setCss3(this.ImageList.children[currentIndex], 'transform', 'translateX(-100%)');
                        } else {
                            this.setCss3(this.ImageList.children[index], 'left', '0%');
                            this.setCss3(this.ImageList.children[currentIndex], 'left', '-100%');
                        }
                    }
                };
                this.animation = true;
                animation();
            } else {
                // before animation,set default position
                if (this.isSupportCss3) {
                    this.setCss3(this.ImageList[index], 'transform', 'translateX(-100%)');
                } else {
                    this.setCss3(this.ImageList[index], 'left', '-100%');
                }
                
                // start transform animation
                let curTime = 0;
                const { currentIndex, interval } = this;
                const animation = () => {

                    if (curTime < interval) {
                        const orignPercent = curTime / interval;
                        const percent = orignPercent * 100;
                        const toPercent = 100 - percent;
                        this.setAttr(this.ImageList.children[index],"data-left",toPercent);
                        this.setAttr(this.ImageList.children[currentIndex],'data-left',percent);
                        if (this.isSupportCss3) {
                            this.setCss3(this.ImageList.children[index], 'transform', `translateX(-${toPercent}%)`);
                            this.setCss3(this.ImageList.children[currentIndex], 'transform', `translateX(${percent}%)`);
                        } else {
                            this.setCss3(this.ImageList.children[index], 'left', `-${toPercent}%`);
                            this.setCss3(this.ImageList.children[currentIndex], 'left', `${percent}%`);
                        }
                        curTime++;
                        setTimeout(animation, 1);
                    } else {
                        this.animation = false;
                        this.timeCount = true;
                        this.currentIndex = index;
                        this.setAttr(this.ImageList.children[index],"data-left",0);
                        this.setAttr(this.ImageList.children[currentIndex],'data-left',100);
                        if (this.isSupportCss3) {
                            this.setCss3(this.ImageList.children[index], 'transform', 'translateX(0%)');
                            this.setCss3(this.ImageList.children[currentIndex], 'transform', 'translateX(100%)');
                        } else {
                            this.setCss3(this.ImageList.children[index], 'left', '0%');
                            this.setCss3(this.ImageList.children[currentIndex], 'left', '100%');
                        }
                        if (!this.mouseIn) {
                            this.timeCount = true;
                        }
                    }
                };
                this.animation = true;
                animation();
            }
        }
    }
    handleOnPrevClick () {
        const { currentIndex,data } = this;
        const nextIndex = currentIndex > 0 ? currentIndex - 1 : data.length - 1;
        this.toNextItem(nextIndex, false);
    }
    handleOnNextClick () {
        const { currentIndex, data } = this;
        const nextIndex = currentIndex < data.length - 1 ? currentIndex + 1 : 0;
        this.toNextItem(nextIndex, true);
    }
    handleImageLoadCompleted(){
        this.setImageContainerSize();
    }
    handleOnContainerMouseIn () {
        this.timeCount = false;
        this.mouseIn = true;
    }
    handleonContainerMouseOut () {
        this.timeCount = true;
        this.mouseIn = false;
    }
    touchStart(myEvent):void{
        const event = myEvent || window.event;
        this.mouseX = event.touches[0].clientX;
        this.mouseY = event.touches[0].clientY;
        this.pressX = this.mouseX;
        this.pressY = this.mouseY;
        const preImage = this.getPreImage();
        const nexImage = this.getNextImage();
        this.pressTime = new Date().getTime();
        if(!this.animation){
            this.timeCount = false;
            this.isPressed = true;
            this.setAttr(preImage,'data-left',-100);
            this.setAttr(nexImage,'data-left',100);
            this.setAttr(this.ImageList.children[this.currentIndex],'data-left',0);
            if(this.isSupportCss3){
                this.setCss3(preImage,"transform","translateX(-100%)");
                this.setCss3(nexImage,"transform","translateX(100%)");
            }else {
                this.setCss(preImage,"left","-100%");
                this.setCss(nexImage,"left","100%");
            }
        }
    }
    touchEnd():void{
        this.isPressed = false;
        const curImage = this.ImageList.children[this.currentIndex];
        const curLeft = parseFloat(this.getAttr(curImage,'data-left'));
        const now = new Date().getTime();
        const effTime = now - this.pressTime ;
        if(Math.abs(effTime)>30 && (Math.abs(this.mouseY-this.pressY)<Math.abs(this.mouseX-this.pressX))){
            if(curLeft>0){
                const index = this.currentIndex-1<0 ? this.ImageList.children.length-1 : this.currentIndex - 1;
                this.toNextItem(index,false);
            }else{
                const index = this.currentIndex+1>this.ImageList.children.length-1 ? 0 : this.currentIndex + 1;
                this.toNextItem(index,true);
            }
        }else {
            const preImage = this.getPreImage();
            const nexImage = this.getNextImage();
            this.setAttr(preImage,'data-left',-100);
            this.setAttr(nexImage,'data-left',100);
            this.setAttr(this.ImageList.children[this.currentIndex],'data-left',0);
        }
    }
    touchMove(myEvent):void{
        if(this.isPressed && !this.animation){
            const event = myEvent || window.event;
            const posX = event.touches[0].clientX;
            const posY = event.touches[0].clientY;
            const effX = posX - this.mouseX;
            const preImage = this.getPreImage();
            const curImage = this.ImageList.children[this.currentIndex];
            const nexImage = this.getNextImage();
            const sWidth = this.ImageList.clientWidth;
            this.mouseX = posX;
            this.mouseY = posY;
            if(sWidth>0){
                const sPercent = effX/sWidth;
                const preLeft = parseFloat(this.getAttr(preImage,'data-left')) + sPercent;
                const nexLeft = parseFloat(this.getAttr(nexImage,'data-left')) + sPercent;
                const curLeft = parseFloat(this.getAttr(curImage,'data-left')) + sPercent;
                if(this.isSupportCss3){
                    this.setCss3(preImage,"transform",`translateX(${preLeft}%)`);
                    this.setCss3(nexImage,"transform",`translateX(${nexLeft}%)`);
                    this.setCss3(curImage,"transform",`translateX(${curLeft}%)`);
                } else {
                    this.setCss3(preImage,"left",`${preLeft}%`);
                    this.setCss3(nexImage,"left",`${nexLeft}%`);
                    this.setCss3(curImage,"left",`${curLeft}%`);
                }
                this.setAttr(preImage,'data-left',preLeft);
                this.setAttr(nexImage,'data-left',nexLeft);
                this.setAttr(curImage,'data-left',curLeft);
            }
        }
    }
    getPreImage(){
        if(this.ImageList && this.ImageList.children.length>0){
            if(this.currentIndex==0){
                return this.ImageList.children[this.ImageList.children.length-1]
            }else {
                return this.ImageList.children[this.currentIndex-1];
            }
        }else {
            return null;
        }
    }
    getNextImage(){
        if(this.ImageList && this.ImageList.children.length>0){
            if(this.currentIndex>=this.ImageList.children.length-1){
                return this.ImageList.children[0];
            }else {
                return this.ImageList.children[this.currentIndex + 1];
            }
        }
    }
    handleOnItemClick(swData):void{
        if(this.onItemClick){
            this.onItemClick.emit(swData);
        }
    }
}