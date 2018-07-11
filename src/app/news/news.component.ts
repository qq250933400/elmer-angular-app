import { Component, ElementRef, AfterViewInit, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LangComponent } from '../../core/lang.component';
import { clsSwappe, clsNewsInfo, IResponseData,INewsListItem, clsUserInfo } from '../../interface/prc.interface';
import { NewsService } from './news.service';
import { AppService } from '../../services/app.service';
@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.css']
})
export class NewsComponent extends LangComponent implements AfterViewInit, OnInit {
    swapperData: clsSwappe[] = new Array<clsSwappe>();
    newsData: clsNewsInfo[]  = new Array<clsNewsInfo>();
    wrapper: Element;
    loadingGIF               = "assets/prc/35.gif";
    emailIcon                = "assets/prc/email.png";
    loadingText              = this.message("loading");
    showLoading              = false;
    pageCount                = 1;
    page                     = 0;
    newsType                 = 0;
    showDownLoadURLDialog    = false;
    showSendDialog           = false;
    showSendConfirm          = true;
    showEmailInput           = true;
    showNewsLoading          = false;
    showWrapper              = false;
    showWrapperLoading       = false;
    showGetSource            = false;
    cancelSendClose          = true;
    emailError               = false;
    isEditEmail              = false;
    isLastNews               = true;
    isHiddenGoto             = false;
    gotoAlignRight           = false;
    toEmail: string          = '';
    logo                     = "assets/prc/gotop.png";
    sourceTitle: string      = this.message("prc.detail.sourceTitle");
    linkTitle: string        = this.message("prc.detail.linkTitle");
    pwdTitle: string         = this.message("prc.detail.pwdTitle");
    btnGetSource: string     = this.message("prc.detail.btnGetSource")
    btnGetMessage:string     = this.message("prc.detail.btnGetMessage");
    btnSend: string          = this.message("prc.detail.btnSend");
    emailPlaceHolder: string = this.message("prc.detail.emailPlaceHolder");
    btnSendLink: string      = this.message("prc.detail.btnSendLink");
    sendSuccess: string      = this.message("prc.detail.sendSuccess");
    sendFaild: string        = this.message("prc.detail.sendFaild");
    selectTip: string        = this.message("prc.news.selectTip");
    editEmail: string        = this.message("prc.news.editEmail");
    allNewsTypeTitle         = this.message("prc.allNews");
    appTitle: string         = this.message('app_title');
    sendResult: string       = this.sendSuccess;
    selectNews: clsNewsInfo[]= new Array<clsNewsInfo>();
    userInfo: clsUserInfo;
    isLogin                  = false;
    currentNewsType          = '';
    mouseY                   = 0;
    pressY                   = 0;
    isPressed                = false;
    moveAnimation            = false;
    contentHeight            = "";
    newsDataList             = [];
    constructor(private ele:ElementRef,
        private sev: NewsService,
        private router: Router,
        private activeRouter: ActivatedRoute,
        private appService: AppService
    ){
        super();
        this.newsData = new Array<clsNewsInfo>();
        this.onScroll = this.onScroll.bind(this);
        this.userInfo = this.appService.getUserInfo();
        this.handleOnWrapperTouchMove = this.handleOnWrapperTouchMove.bind(this);
        this.handleOnWrapperTouchStart = this.handleOnWrapperTouchStart.bind(this);
        this.handleOnWrapperTouchEnd = this.handleOnWrapperTouchEnd.bind(this);
        const typeTitle = this.appService.getNewsTypeTitle();
        if(this.isLastNews) {
            this.currentNewsType = this.message("prc.latestnews");
        } else {
            this.currentNewsType = typeTitle;
        }
        if (this.appTitle && this.appTitle.length > 0) {
            document.title = this.appTitle;
        }
    }
    ngOnInit():void{
        this.newsData = new Array<clsNewsInfo>();
        this.newsDataList = [];
        this.activeRouter.params.subscribe((data:Params)=>{
            const type = data['type'];
            const value = data['search'] || '';
            this.sev.setNewsType(type);
            this.sev.setNewsSearch(value);
            this.newsType = type>=0 ? type:0;
            this.appService.setSearchNewsValue(value);
            this.newsData = new Array<clsNewsInfo>();
            this.newsDataList = [];
            this.page = 0;
            this.pageCount = 1;
            //-----------
            const searchValue = this.appService.getSearchNewsValue();
            if(searchValue == undefined || searchValue== null || searchValue.length<=0) {
                const typeTitle = this.appService.getNewsTypeTitle();
                if(typeTitle == null || typeTitle === undefined || typeTitle.length<=0) {
                    if(type == undefined || type == 0) {
                        this.currentNewsType = this.message("prc.latestnews");
                    }else {
                        this.currentNewsType = this.message("prc.allNews");
                    }
                } else {
                    this.currentNewsType = typeTitle;
                }
                if(type == 0 || type == undefined) {
                    this.showWrapper = true;
                    this.isLastNews = true;
                    this.isHiddenGoto = true;
                    this.currentNewsType = this.message("prc.latestnews");
                }else {
                    this.showWrapper = false;
                    this.isLastNews = false;
                }
            }else {
                this.currentNewsType = this.message("prc.allNews");
                this.showWrapper = false;
            }
            if(this.newsType>0){
                this.showWrapper = false;
            }
            this.isLogin && this.loadNewData();
        });
        if(this.userInfo === undefined || this.userInfo === null || this.userInfo.userID === undefined ||
            this.userInfo.userID === null || this.userInfo.userID<=0) {
            this.appService.getUserInfomation()
                .then((data)=>{
                    this.isLogin = true;
                    this.loadSwapperData();
                    this.loadNewData();
                }).catch((err)=>{
                    this.isLogin = false;console.log(err);
                    alert(err ? (err['msg'] ? err['msg'] : err) : 'Unknow Error');
                    const myUrl = encodeURIComponent(this.appService.baseURL + 'Public/prc/index.html#/prc/news');
                    if(err && err['outlogin']){
                        window.location.href=this.serviceURLs.loginURL + "&url="+myUrl;        
                    }else{
                        if(err['redirect'] && this.isString(err['redirect'])) {
                            const pathStr = err['redirect'];
                            const pathArr = pathStr.replace(/^\//,'').replace(/\/$/,'').split('/');
                            this.router.navigate(pathArr);
                        }
                    }
                });
        } else {
            this.isLogin = true;
            this.loadSwapperData();
            this.loadNewData();
        }
        const searchValue = this.appService.getSearchNewsValue();
        if(searchValue !== undefined && searchValue !== null && searchValue.length>0){
            this.showWrapper = false;
        }
    }
    ngAfterViewInit():void{
        const context = this.ele.nativeElement.querySelector(".nav_context");
        this.wrapper = document.querySelector("#newsCenter");
        this.addEvent(this.wrapper,"scroll",this.onScroll);
        this.addEvent(this.wrapper,"touchstart",this.handleOnWrapperTouchStart);
        this.addEvent(this.wrapper,"touchmove",this.handleOnWrapperTouchMove);
        this.addEvent(this.wrapper,"touchend",this.handleOnWrapperTouchEnd);
        this.addEvent(this.wrapper,"mousedown",this.handleOnWrapperTouchStart);
        this.addEvent(this.wrapper,"mousemove",this.handleOnWrapperTouchMove);
        this.addEvent(this.wrapper,"mouseup",this.handleOnWrapperTouchEnd);
        this.contentHeight = context.clientHeight + "px";
        this.setCss(context.querySelector("#newsContext"),"height",this.contentHeight);
    }
    loadSwapperData():void{
        this.showWrapperLoading = true;
        this.appService.getWrapperNews(this.local)
            .then((data)=>{
                const wrapperData = data['data'];
                this.showWrapperLoading = false;
                if(wrapperData.length>0){
                    this.swapperData = new Array<clsSwappe>();
                    for(const key in wrapperData) {
                        const tmpData = wrapperData[key];
                        this.swapperData.push({
                            title: tmpData['title'],
                            imageUrl: this.appService.baseURL + tmpData['headimage'],
                            url:"prc/detail/" + tmpData['news_id']
                        });
                    }
                    if(this.swapperData.length<2){
                        const afData = this.swapperData[0];
                        this.swapperData.push({
                            title: afData.title,
                            imageUrl: afData.imageUrl,
                            url: afData.url
                        });
                    }
                    const searchValue = this.appService.getSearchNewsValue();
                    if((searchValue === undefined || searchValue === null || searchValue.length<=0) && this.isLastNews){
                        this.showWrapper = true;
                    }
                    if(this.newsType>0){
                        this.showWrapper = false;
                    }
                }else {
                    this.showWrapper = false;
                }
            }).catch((err)=>{
                this.showWrapperLoading = false;
            });
    }
    loadNewData():void{
        if(this.pageCount> this.page && !this.showNewsLoading){
            this.showNewsLoading = true;
            if(this.page == 0 && this.newsData.length>0){
                this.newsData = new Array<clsNewsInfo>();
                this.newsDataList = [];
            }
            this.sev.getNewsList(this.page, this.isLastNews, this.local).then((data:IResponseData)=>{
                this.showNewsLoading = false;
                if(data.success){
                    const tmpData: object[] = <object[]>data.data;
                    if(this.page === 0) {
                        this.newsData = new Array<clsNewsInfo>();
                        this.newsDataList = [];
                    }
                    this.page = this.page + 1;
                    tmpData && tmpData.map((news)=>{
                        
                        const tmpNews = {
                            title: news['title'],
                            titleImageUrl: this.appService.baseURL + news['headimage'],
                            date: news['createDate'],
                            description: news['description'],
                            id: news['news_id']
                        };
                        if(this.newsDataList.indexOf(tmpNews.id)<0) {
                            tmpNews["downloadurl"] = news['downloadurl'];
                            tmpNews["downloadpwd"] = news['downloadpwd'];
                            this.newsData.push(tmpNews);
                            this.newsDataList.push(tmpNews.id);
                        }
                    });
                    this.pageCount = parseInt(data['pageCount']);                   
                }else {
                    alert(data.info);
                    if(data['redirect'] && this.isString(data['redirect'])) {
                        const pathStr = data['redirect'];
                        const pathArr = pathStr.replace(/^\//,'').replace(/\/$/,'').split('/');
                        this.router.navigate(pathArr);
                    }
                    if(data['toStatus']) {
                        this.router.navigate(['prc', 'status']);
                    }else if(data['toFinish']){
                        this.router.navigate(['prc', 'finish']);
                    }else if(data['outlogin']) {
                         window.location.href = this.appService.baseURL + "index.php?m=Prc&c=Index&a=index";
                    }
                }
            }).catch((err)=>{
                this.showNewsLoading = false;
                console.log(err);
            });
        }
    }
    newsItemClick(news:clsNewsInfo):void{
        if(!this.showGetSource){
            this.router.navigate(['prc', 'detail', news.id]);
            // this.router.navigateByUrl("prc/detail/"+news.id);
           // window.location.href = this.appService.baseURL + "Public/prc/index.html#/prc/detail/" + news.id;
        } else {
            news.isChecked = !news.isChecked;
            this.selectNews = new Array<clsNewsInfo>();
            this.newsData && this.newsData.map && this.newsData.map((tmpNews:clsNewsInfo)=>{
                if(tmpNews.isChecked) {
                    this.selectNews.push(tmpNews);
                }
            });
        }
    }
    newsImageClick(event:Event,news: clsNewsInfo):void{
        // event.cancelBubble = true;
        // news.isChecked = !news.isChecked;
        // this.selectNews = new Array<clsNewsInfo>();
        // this.newsData && this.newsData.map && this.newsData.map((tmpNews:clsNewsInfo)=>{
        //     if(tmpNews.isChecked) {
        //         this.selectNews.push(tmpNews);
        //     }
        // });
    }
    onScroll(event:Event):void{
        if (Math.abs(this.wrapper.scrollHeight - this.wrapper.clientHeight - this.wrapper.scrollTop)<=8 && this.newsType>=0){
            if(!this.showGetSource && !this.isLastNews){
                this.loadNewData();
            }
        }
        if(this.wrapper.scrollTop > 30 && this.isLastNews) {
            this.isHiddenGoto = true;
        } else {
            this.isHiddenGoto = false;
        }
    }
    handleOnGoToAllNews(event:Event):void{
        event.cancelBubble = true;
        this.isLastNews = false;
        this.showWrapper = false;
        this.isHiddenGoto = false;
        this.page = 0;
        this.currentNewsType = this.message("prc.allNews");
        this.newsData = new Array<clsNewsInfo>();
        this.newsDataList = [];
        this.loadNewData();
    }
    handleOnDownloadClick():void{
        this.gotoAlignRight = true;
        this.showGetSource = !this.showGetSource;
        if(!this.showGetSource) {
            this.newsData && this.newsData.map((item)=>{
                item.isChecked = false;
            });
            if(this.isLastNews) {
                this.isHiddenGoto = true;
            }
        }else {
            this.isHiddenGoto = false; 
        }
    }
    handleOnGetSourceClick(event:Event):void{
        event.cancelBubble = true;
        if(this.selectNews.length>0){
            this.showDownLoadURLDialog = true;
        }else {
            this.sendResult = this.selectTip;
            this.showEmailInput = false;
            this.showSendConfirm = false;
            this.showSendDialog = true;
        }
    }
    handleOnDownloadConfirm():void{
        this.showDownLoadURLDialog = false;
        this.isEditEmail = false;
        this.showEmailInput = true;
        this.showSendConfirm = true;
        this.showSendDialog = true;
        this.btnSend = this.message("prc.detail.btnSend");
    }
    handleonDownLoadClose():void{
        this.showDownLoadURLDialog = false;
    }
    handleOnSendEmail():void{
        if(!this.isEditEmail) {
            this.showLoading = true;
            const ids = [];
            this.selectNews.map((news)=>{
                ids.push(news.id);
            });
            this.appService.sendNewsSourceToEmail(ids, this.toEmail)
                .then((data)=>{
                    this.showLoading = false;
                    if(data['success']) {
                        this.sendResult =  this.sendSuccess;
                        this.showSendConfirm = false;
                        this.showEmailInput = false;
                    }else {
                        this.sendResult = data['info'] || this.sendFaild;
                        if(!data['errEmail']) {
                            this.showSendConfirm = false;
                            this.showEmailInput = false;
                        }else {
                            this.showEmailInput = false;
                            this.showSendConfirm = true;
                            this.btnSend = this.editEmail;
                            this.isEditEmail = true;
                        }
                    }
                }).catch((err)=>{
                    this.showLoading = false;
                    this.sendResult = err;
                    this.showSendConfirm = false;
                    this.showEmailInput = false;
                });
            } else {
                this.btnSend = this.message("prc.detail.btnSend");
                this.showEmailInput = true;
                this.showSendConfirm = true;
                this.isEditEmail = false;
            }
    }
    handleOnSendEmailClose():void{
        this.showSendDialog = false;
    }
    handleOnEmailChange(value: string):void{
        this.toEmail = value;
        this.emailError = !/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z]{2,5}$/.test(this.toEmail);
    }
    handleOnSwapperItemClick(data:clsSwappe):void{
        this.router.navigate(data.url.split('/'));
    }
    handleOnWrapperTouchStart(event):void{
        const posY = event.touches ? event.touches[0].clientY : event.clientY;
        this.isPressed = true;
        this.mouseY = posY;
        this.pressY = posY;
    }
    handleOnWrapperTouchMove(event):void{
        try{
            const posY = event.touches ? event.touches[0].clientY : event.clientY;
            if(this.wrapper && this.isPressed && this.wrapper.scrollTop<=0 && !this.moveAnimation) {
                const effY = posY - this.mouseY;
                const mTop = this.wrapper['style']['marginTop'];
                let nTop = mTop.length<= 0 ? 0 : mTop.replace("px",'');
                nTop = parseInt(nTop) + effY;
                this.mouseY = posY;
                // if(nTop>0){
                //     this.wrapper['style']['marginTop'] = nTop+ "px";
                //     this.mouseY = posY;
                // }
            }
        }catch(e){
            alert(e.message);
        }
        // console.log(this.wrapper.scrollTop, this.isPressed);
    }
    handleOnWrapperTouchEnd(event:Event):void{
        this.isPressed = false;
        const mTop = this.wrapper['style']['marginTop'];
        const nTop = this.mouseY - this.pressY;//mTop.length<= 0 ? 0 : mTop.replace("px",'');
        if(!this.moveAnimation){
            if(nTop>60 && this.newsType == 0){
                if(!this.isLastNews) {
                    this.isLastNews = true;
                    this.showWrapper = true;
                    this.isHiddenGoto = true;
                    this.page = 0;
                    this.currentNewsType = this.message("prc.latestnews");
                    //this.wrapper['style']['marginTop'] = 0;
                    // this.router.navigateByUrl("prc/news/0");
                    this.newsData = new Array<clsNewsInfo>();
                    this.newsDataList = [];
                    this.loadNewData();
                    return;
                }
            }
        }
    }
    handleOnNavMenuItemClick():void{
       // this.newsData = new Array<clsNewsInfo>();
    }
}
