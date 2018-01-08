import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangComponent } from '../../core/lang.component';
import { AppService } from '../../services/app.service';
import { PinYinService } from '../../services/pinyin.service';
import { clsUserInfo, UserType } from '../../interface/prc.interface';
import { IGift } from './gift.interface';
import { GiftService } from './gift.service';
@Component({
    selector: "app-gift",
    templateUrl: "./gift.component.html",
    styleUrls:[
        "./gift.component.css",
        "../register/register.component.css"]
})
export class GiftComponent extends LangComponent implements OnInit {
    field_Name: string        = "姓名：";
    field_Phone: string       = "电话：";
    provinceStr: string       = "省";
    cityStr:     string       = "市";
    field_Location: string    = "地址：";
    mobilePhoneDisplay: string= "";
    mobilePhone: string       = "";
    province:any              = [];
    city:any                  = [];
    selectProvinceCode: string="";
    selectProvince;
    selectCityCode;
    selectCity;
    loadProvince: boolean     = false;
    loadCity:boolean          = false;
    isShowLoading: boolean    = false;
    isShowConfirm: boolean    = false;
    ActiveID: string          = "20180107104500001";
    isShowChoseGift: boolean  = false;
    isShowFinish: boolean     = false;
    isHiddenHomeTips: boolean = false;
    ChoseGift: IGift          = { title:"芝华士·水楢",desc:"限定版苏格兰威士忌", size:"700ml 一瓶", image:"assets/gift/chivasRegal.png" };
    GiftList:Array<IGift>     = new Array<IGift>();
    isVIP: boolean            = true;
    userInfo: clsUserInfo     = null;
    userName: string          = '';
    address: string           = '';
    constructor(private appService: AppService,
        private pinYinService: PinYinService,
        private route:Router,
        private giftService: GiftService
    ) {
        super();
    }
    ngOnInit():void{
        this.isShowLoading = true;
        this.userInfo = this.appService.getUserInfo();
        this.appService.getProvince().then((data: Response) => {
            if (data.status == 200) {
                const provinceData = data.json();
                let isExists = false;
                for (const key in provinceData) {
                    if (this.local === 'en') {
                        let provinceName = provinceData[key]['name'];
                        provinceName = provinceName !== undefined || provinceName !== null ? provinceName.toString() : '';
                        provinceData[key]['name'] = this.getPinYin(provinceName);
                    }
                    if (provinceData[key]['code'] == this.selectProvinceCode) {
                        this.selectProvince = provinceData[key];
                        isExists = true;
                    }
                }
                if(!isExists){
                    this.selectProvince = provinceData[0];
                    this.selectCityCode = this.selectProvince['code'];
                }
                this.province = provinceData;
                this.getCity();
            }
            this.loadProvince = true;
            this.isShowLoading = false;
        }).catch((err) => {
            console.log(err);
            this.loadProvince = true;
            this.isShowLoading = false;
        });
        if(!this.userInfo.userID) {
            this.appService.getUserInfomation()
                .then((data:clsUserInfo)=>{
                    this.isShowLoading = false;
                    this.userInfo = data;
                    this.checkUserAuth();
                }).catch((err)=>{
                    this.isShowLoading = false;
                    alert(this.isString(err) ? err : (this.isObject(err) ? err['msg'] : 'Unknow Error'));
                    this.route.navigate(['prc', 'news']);
                });
        }else {
            this.isShowLoading = false;
            this.checkUserAuth();
        }
        this.giftService.getActivityInfo().then((data)=>{
            if(data['isInActivity']) {
                const info = data['ActivityInfo']
                this.selectProvinceCode = info['province_code'];
                this.selectCityCode = info['city_code'];
                this.address = info['address'];
                this.userName = !this.isNull(info['user_name']) ? info['user_name'] : this.userName;
                this.mobilePhone = !this.isNull(info['mobile_phone']) ? info['mobile_phone'] : this.mobilePhone;
                this.mobilePhoneDisplay = this.mobilePhone;
                if(this.province && this.province.length>0){
                    for(var key in this.province){
                        if(this.province[key]['code']===this.selectProvinceCode){
                            this.selectProvince = this.province[key];
                        }
                    }
                    this.getCity(true);
                }
                if(!data['isConfirm']){
                    this.isShowConfirm = true;
                    this.isHiddenHomeTips = true;
                }else {
                    this.isHiddenHomeTips = true;
                    this.isShowFinish = true;
                }
            }
        }).catch((err)=>{
            console.log(err);
        });
    }
    checkUserAuth():void{
        this.isVIP = /^(vip)/i.test(this.userInfo.level);
        this.loadGiftList();
        this.userName = this.userInfo.userName;
        this.mobilePhone = this.userInfo.mobilePhone;
        this.mobilePhoneDisplay = this.formatMobilePhone(this.mobilePhone);
        this.selectProvinceCode = this.userInfo.province;
        this.selectCityCode = this.userInfo.city;
        if(this.province && this.province.length>0){
            for(var key in this.province){
                if(this.province[key]['code']===this.selectProvinceCode){
                    this.selectProvince = this.province[key];
                }
            }
            this.getCity(true);
        }
        if(this.userInfo.userType !== UserType.MediaUser || /wechat/i.test(this.userInfo.regType)){
            alert("您没有参加此活动的资格！");
            this.route.navigate(['prc', 'news']);
        }
    }
    loadGiftList():void{
        if (this.isVIP) {
            this.GiftList.push({
                title: "杰卡斯鉴时系列",
                desc:"1819酿时葡萄酒",
                size:"750ml 一瓶",
                image: "assets/gift/jacobs.png",
                id: "Gift_JKS"
            });
            this.GiftList.push({
                title: "芝华士·水楢",
                desc:"限定版苏格兰威士忌",
                size:"700ml 一瓶",
                image: "assets/gift/chivasRegal.png",
                id: "Gift_chivas"
            });
            this.GiftList.push({
                title: "巴黎之花",
                desc:"特级干型香槟<br/>迈阿密城市限量版",
                size:"750ml 一瓶",
                image: "assets/gift/perrier_jouet.png",
                id: "Gift_perrier"
            });
        } else {
            this.GiftList.push({
                title: "绝对伏特加",
                desc:"uncover隐夜装限量版",
                size:"750ml 一瓶",
                image: "assets/gift/jacobs.png",
                id: "Gift_absolutvodka"
            });
            this.GiftList.push({
                title: "杰卡斯J小调系列",
                desc:"Little J清妍<br/>葡萄红酒750ml 一瓶",
                size:"",
                image: "assets/gift/little_j.png",
                id: "Gift_littleJ"
            });
            this.GiftList.push({
                title: "马爹利",
                desc:"鼎盛干邑白兰地",
                size:"700ml 一瓶",
                image: "assets/gift/madeli.png",
                id: "Gift_JKS"
            });
        }
    }
    getCity(hiddenLoading?:boolean): void {
        const selectProv = this.selectProvince || this.province[0];
        if (selectProv !== null && selectProv['code'] && selectProv['code'].length > 0) {
            const code = selectProv['code'];
            if(!hiddenLoading)this.isShowLoading = true;
            this.appService.getCity(code.toString()).then((res: Response) => {
                if (res.status === 200) {
                    const cities = res.json();
                    let isSelected = false;
                    this.city = cities;
                    for (const key in cities) {
                        if (this.local === 'en') {
                            cities[key]['name'] = this.getPinYin(cities[key]['name']);
                        }
                        if (cities[key]['code'] == this.selectCityCode) {
                            this.selectCity = cities[key];
                            isSelected = true;
                        }
                    }
                    if (!isSelected) {
                        this.selectCity = cities[0];
                    }
                }

                this.loadCity = true;
                this.isShowLoading = false;
            }).catch((err) => {
                this.loadCity = true;
                this.isShowLoading = false;
                console.log(err);
            });
        }else {
            this.loadCity = true;
        }
    }
    provinceChange():void{
        this.city = [];
        this.getCity();
    }
    getPinYin(value: string): string {
        return this.pinYinService.ConvertPinyin(value);
    }
    mobileChange(event:string): void {
        const newValue = event.replace(/\-[a-zA-Z]*/g, '');
        this.mobilePhone = newValue;
        this.mobilePhoneDisplay = this.formatMobilePhone(newValue);
    }
    mobileKeyDown(event: KeyboardEvent): void {
        const keyCode = event.keyCode;
        let value = event.target['value'];
        value = value.replace(/\-[a-zA-Z]*/g, '');
        if ((keyCode >= 47 && keyCode <= 58) || keyCode === 8 || keyCode === 37 || keyCode === 39 ||
            keyCode === 46 || (keyCode >= 97 && keyCode <= 105)) {
            if (value.length >= 11 && keyCode !== 8) {
                event.preventDefault();
            } else {
                return;
            }
        } else {
            event.preventDefault();
        }
    }
    handleOniftContextClick(evt):void{
        evt.cancelBubble = true;
    }
    handleONgiftMaskClick():void{
        this.isShowChoseGift = false;
        this.isHiddenHomeTips = false;
    }
    handleOnChoseClick(giftID: string|number): void{
        if(this.GiftList[giftID]) {
            this.ChoseGift = this.GiftList[giftID];
            this.isShowChoseGift = true;
            this.isHiddenHomeTips = false;
        } else {
            alert("选择礼物错误！");
        }
    }
    handleOnConfirmClick():void{
        this.isShowLoading = true;
        this.giftService.ConfirmInfoChoseGift({
            userName: this.userName,
            mobilePhone: this.mobilePhone,
            provinceCode: this.selectProvince['code'],
            province: this.selectProvince['name'],
            cityCode: this.selectCity['code'],
            city: this.selectCity['name'],
            address: this.address
        }).then((data)=>{
            this.isShowLoading = false;
            this.isShowFinish = true;
            this.isShowConfirm = false;
            this.isShowChoseGift = false;
            this.isHiddenHomeTips = true;
        }).catch((err)=>{
            this.isShowLoading = false;
            alert(err['msg']);
        });
    }
    handleOnConfirmGift():void{
        this.isShowLoading = true;
        this.giftService.AcceptChoseGift({
            giftID: this.ChoseGift.id,
            giftName: this.ChoseGift.title,
            giftDesc: this.ChoseGift.desc,
            giftSize: this.ChoseGift.size,
            giftImage: this.ChoseGift.image
        }).then((data)=>{
            console.log(data);
            this.isShowLoading = false;
            this.isShowConfirm = true;
            this.isShowChoseGift = false;
            this.isHiddenHomeTips = true;
        }).catch((err)=>{
            this.isShowLoading = false;
            alert(err['msg']);
            if(err && err.data && err.data.ActiveID){
                this.isShowConfirm = true;
                this.isShowChoseGift = false;
                this.isHiddenHomeTips = true;
            }
        });
    }
    inputChange(event,key):void{
        // console.log(event);
        this[key] = event;
    }
    goNews():void{
        this.route.navigate(['prc', 'news']);
    }
}