import { Component, OnInit, AfterViewInit, ElementRef, DoCheck } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LangComponent } from '../../core/lang.component';
import { AppService } from '../../services/app.service';
import { clsUserInfo } from '../../interface/prc.interface';
@Component({
    selector:"app-detail",
    templateUrl:'./detail.component.html',
    styleUrls:['./detail.component.css']
})
export class DetailComponent extends LangComponent implements OnInit, AfterViewInit, DoCheck {
    showLoading = true;
    cancelSendClose = true;
    showSendDialog = false;
    showSendConfirm = true;
    showEmailInput = true;
    showSendMoreInfoResult = false;
    showMoreInfo = false;
    emailError = false;
    newsData: object;
    content: object[] = new Array<object>();
    baseUrl: string;
    showDownLoadURLDialog = false;
    newsID: number;
    downloadURL: string;
    downloadPWD: string;
    toEmail: string = '';
    sendResult = "";
    moreInfo: Element;
    emailIcon = "assets/prc/email.png";
    sourceTitle: string = this.message("prc.detail.sourceTitle");
    linkTitle: string = this.message("prc.detail.linkTitle");
    pwdTitle: string = this.message("prc.detail.pwdTitle");
    btnGetSource: string = this.message("prc.detail.btnGetSource")
    btnGetMessage:string = this.message("prc.detail.btnGetMessage");
    btnSend: string = this.message("prc.detail.btnSend");
    emailPlaceHolder: string = this.message("prc.detail.emailPlaceHolder");
    btnSendLink: string = this.message("prc.detail.btnSendLink");
    sendSuccess: string = this.message("prc.detail.sendSuccess");
    sendFaild: string = this.message("prc.detail.sendFaild");
    btnSubmit: string = this.message("prc.detail.btnSubmit");
    moreInfoHolder: string = this.message("prc.detail.moreInfoHolder");
    moreInfoEmail: string = this.message("prc.detail.moreInfoEmail");
    moreInfoText: string = "";
    MenuBarDisable       = true;
    userInfo: clsUserInfo;
    constructor(private activeRouter: ActivatedRoute,
        private appService:AppService,
        private router:Router,
        private ele:ElementRef
    ){
        super();
        this.baseUrl = this.appService.baseURL;
        this.handleOnMoreInfoAnimationEnd = this.handleOnMoreInfoAnimationEnd.bind(this);
        this.userInfo = this.appService.getUserInfo();
    }
    ngOnInit():void{
        this.activeRouter.params.subscribe((data:Params)=>{
            const detailID = data['detailID'];
            this.newsID = detailID;
            this.appService.getNewsDetail(detailID).then((data)=>{
                if(data['success']){
                    var newsData = data['data'];
                    newsData['appID'] = data['tencentVideoAppID'];
                    this.showLoading = false;
                    this.newsData = newsData;
                    const title = this.newsData['title'];
                    document.title = title;
                    this.downloadURL = this.newsData['downloadurl'];
                    this.downloadPWD = this.newsData['downloadpwd'];
                    this.content = this.newsData['content'] || new Array<object>();
                    this.appService.sendViewLog(this.newsID);//发送用户阅读记录，不需要关注操作是否成功，不影响用户体验
                }else {
                    alert(data['info']);
                    this.router.navigateByUrl('prc/news/'+ this.appService.getRouterType());
                }
            }).catch((msg)=>{
                alert(msg);
                this.router.navigateByUrl('prc/news/'+ this.appService.getRouterType());
            });
        });
        if(this.userInfo === undefined || this.userInfo === null || this.userInfo.userID === undefined ||
            this.userInfo.userID === null || this.userInfo.userID<=0) {
            this.appService.getUserInfomation().then((data:clsUserInfo)=>{
                this.userInfo = data;
                if(this.userInfo.userType === null || this.userInfo.userType === undefined || this.userInfo.userType.toString().length<=0) {
                    //this.MenuBarDisable = true;
                }
            }).catch((err)=>{
               // alert(err);
               // let myUrl = encodeURIComponent(this.appService.baseURL + 'Public/prc/index.html#/prc/detail');
                //myUrl = this.appService.baseURL + "index.php?m=Prc&c=Index&a=index&url="+myUrl;
               // window.location.href=myUrl;
                //this.MenuBarDisable = true;
            });
        }
    }
    ngAfterViewInit():void{
        const moreInfo = this.ele.nativeElement.querySelector(".more_info");
        if(moreInfo){
            this.moreInfo = moreInfo;
            this.animationEnd(moreInfo,this.handleOnMoreInfoAnimationEnd);
        }
    }
    ngDoCheck():void{
        const moreInfo = this.ele.nativeElement.querySelector(".more_info>div>div");
        if(moreInfo){
            this.moreInfo = moreInfo;
            this.removeAnimationEnd(moreInfo,this.handleOnMoreInfoAnimationEnd);
            this.animationEnd(moreInfo,this.handleOnMoreInfoAnimationEnd);
        }
        if(this.isArray(this.content) && this.content.length>0){
            for(var i=0;i<this.content.length;i++){
                var tmpItem = this.content[i];
                if(tmpItem['type'] == "video" && !tmpItem['attachedPlayer']){
                    var videoID = "newsVideo" + tmpItem['index'];
                    const videoDOM = this.ele.nativeElement.querySelector("#"+videoID);
                    if(videoDOM){
                        var oldValue = videoDOM.getAttribute("attached", 1);
                        if(oldValue != "1"){
                            videoDOM.setAttribute("attached", 1);
                            var player = TCPlayer(videoID, { // player-container-id 为播放器容器ID，必须与html中一致
                                fileID: tmpItem['value'], // 请传入需要播放的视频filID 必须
                                appID: this.newsData['appID'], // 请传入点播账号的appID 必须
                                autoplay: false //是否自动播放
                                //其他参数请在开发文档中查看
                            });
                        }
                    }
                }
            }
        }
    }
    handleOnDownloadClick():void{
        this.showDownLoadURLDialog = true;
        this.showSendConfirm = true;
        this.showEmailInput = true;
    }
    handleonDownLoadClose():void{
        this.showDownLoadURLDialog = false;
    }
    handleOnDownloadConfirm():void{
        this.showDownLoadURLDialog = false;
        this.showSendDialog = true;
    }
    handleOnSendEmail():void{
        this.showLoading = true;
        this.appService.sendNewsSourceToEmail([this.newsID],this.toEmail)
            .then((data)=>{
                this.showLoading = false;
                if(data['success']) {
                    this.showSendConfirm = false;
                    this.showEmailInput = false;
                    this.sendResult = this.sendSuccess;
                } else {
                    // alert(data['info']);
                    this.sendResult = data['info'] || this.sendFaild.replace(/\{value\}/g,data['info']);
                    this.showEmailInput = false;
                    this.showSendConfirm = false;
                    this.showSendDialog = true;
                }
            }).catch((err)=>{
                this.showLoading = false;
                this.showEmailInput = true;
                this.sendResult = this.sendFaild;
                alert(err);
            });
    }
    handleOnSendEmailClose():void{
        this.showSendDialog = false;
    }
    handleOnMoreInfoClick():void{
        this.showMoreInfo = true;
    }
    handleOnMoreInfoClose():void{
        this.moreInfo.classList.remove("showMoreInfoAnimation");
        this.moreInfo.classList.add("hiddenMoreInfoAnimation");
    }
    handleOnMoreInfoAnimationEnd():void{
        if(this.hasClass(this.moreInfo,"hiddenMoreInfoAnimation")){
           this.showMoreInfo = false;
        }
    }
    handleOnMoreMaskClick(event):void{
        this.handleOnMoreInfoClose();
    }
    handleOnMoreContentClick(event:Event):void{
        event.cancelBubble = true;
    }
    handleOnMoreEmailChange(event): void{
        this.toEmail = event;
        this.emailError = !/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z]{2,5}$/.test(this.toEmail);
    }
    handleOnMoreSubmitClick():void{
       //this.appService.sen
       this.showLoading = true;
       this.appService.sendMoreInfoEmail(this.toEmail,this.moreInfoText)
            .then((data)=>{
                this.showLoading = false;
                if(data['success']) {
                    this.sendResult = this.sendSuccess;
                    this.showSendMoreInfoResult = true;
                    this.handleOnMoreInfoClose();
                }else {
                    this.sendResult = data['info'];
                    this.showSendMoreInfoResult = true;
                    this.handleOnMoreInfoClick();
                }
            }).catch((err)=>{
                this.showLoading = false;
                this.sendResult = err;
                this.showSendMoreInfoResult = true;
                this.handleOnMoreInfoClick();
            });
    }
    handleTextAreaChange(event:Event):void{
        this.moreInfoText = event.target['value'];
    }
    handleOnMoreInfoResultClose():void{
        this.showSendMoreInfoResult = false;
    }
}