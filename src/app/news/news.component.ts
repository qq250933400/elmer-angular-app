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
    sendResult: string       = this.sendSuccess;
    selectNews: clsNewsInfo[]= new Array<clsNewsInfo>();
    userInfo: clsUserInfo;
    isLogin                  = false;
    currentNewsType          = '';
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
        const typeTitle = this.appService.getNewsTypeTitle();
        if(typeTitle == null || typeTitle === undefined || typeTitle.length<=0) {
            this.currentNewsType = this.message("prc.latestnews");
        } else {
            this.currentNewsType = typeTitle;
        }
    }
    ngOnInit():void{
        this.activeRouter.params.subscribe((data:Params)=>{
            const type = data['type'];
            const value = data['search'] || '';
            this.sev.setNewsType(type);
            this.sev.setNewsSearch(value);
            this.newsType = type;
            this.appService.setSearchNewsValue(value);
            this.newsData = new Array<clsNewsInfo>();
            this.page = 0;
            this.pageCount = 1;
            this.isLogin && this.loadNewData();
            //-----------
            const searchValue = this.appService.getSearchNewsValue();
            if(searchValue == undefined || searchValue== null || searchValue.length<=0) {
                const typeTitle = this.appService.getNewsTypeTitle();
                if(typeTitle == null || typeTitle === undefined || typeTitle.length<=0) {
                    this.currentNewsType = this.message("prc.latestnews");
                } else {
                    this.currentNewsType = typeTitle;
                }
                if(this.appService.getRouterType()==0) {
                    this.showWrapper = true;
                }else {
                    this.showWrapper = false;
                }
            }else {
                this.currentNewsType = this.message("prc.allNews");
                this.showWrapper = false;
            }

        });
        if(this.userInfo === undefined || this.userInfo === null || this.userInfo.userID === undefined ||
            this.userInfo.userID === null || this.userInfo.userID<=0) {
            this.appService.getUserInfomation()
                .then((data)=>{
                    this.isLogin = true;
                    this.loadSwapperData();
                    this.loadNewData();
                }).catch((err)=>{
                    this.isLogin = false;
                    alert(err);
                    const myUrl = encodeURIComponent(this.appService.baseURL + 'Public/prc/index.html#/prc/news');
                    window.location.href=this.appService.baseURL + "index.php?m=Prc&c=Index&a=index&url="+myUrl;        
                });
        } else {
            this.isLogin = true;
            this.loadSwapperData();
            this.loadNewData();
        }
    }
    ngAfterViewInit():void{
        this.wrapper = document.querySelector("#newsCenter");
        this.addEvent(this.wrapper,"scroll",this.onScroll);
    }
    loadSwapperData():void{
        this.showWrapperLoading = true;
        this.appService.getWrapperNews()
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
                    this.showWrapper = true;
                }else {
                    this.showWrapper = false;
                }
            }).catch((err)=>{
                this.showWrapperLoading = false;
            });
    }
    loadNewData():void{
        if(this.pageCount>= this.page){
            this.showNewsLoading = true;
            this.sev.getNewsList(this.page).then((data:IResponseData)=>{
                this.showNewsLoading = false;
                if(data.success){
                    const newsData: object[] = <object[]>data.data;
                    if(this.page === 0) this.newsData = new Array<clsNewsInfo>();
                    newsData && newsData.map((news)=>{
                        const tmpNews = {
                            title: news['title'],
                            titleImageUrl: this.appService.baseURL + news['headimage'],
                            date: news['createDate'],
                            description: news['description'],
                            id: news['news_id']
                        };
                        tmpNews["downloadurl"] = news['downloadurl'];
                        tmpNews["downloadpwd"] = news['downloadpwd'];
                        this.newsData.push(tmpNews);
                    });
                    this.pageCount = data['pageCount'];
                    this.page = this.page + 1;
                }else {
                    alert(data.info);
                }
            }).catch((err)=>{
                this.showNewsLoading = false;
                console.log(err);
            });
        }
    }
    newsItemClick(news:clsNewsInfo):void{
        if(!this.showGetSource){
            this.router.navigateByUrl("prc/detail/"+news.id);
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
    onScroll(event):void{
        if (Math.abs(this.wrapper.scrollHeight - this.wrapper.clientHeight - this.wrapper.scrollTop)<=8 && this.newsType>=0){
            this.loadNewData();
        }
    }
    handleOnDownloadClick():void{
        this.gotoAlignRight = true;
        this.showGetSource = !this.showGetSource;
        if(!this.showGetSource) {
            this.newsData && this.newsData.map((item)=>{
                item.isChecked = false;
            })
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
        const url = data.url;
        this.router.navigateByUrl(url);
    }
}
