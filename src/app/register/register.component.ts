import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangComponent } from '../../core/lang.component';
import { AppService } from '../../services/app.service';
import { PinYinService } from '../../services/pinyin.service';
import { IUserInfo,clsUserInfo } from '../../interface/prc.interface';
import { IRegsiterTypeData, clsRegisterType,UserType } from '../../interface/prc.interface';

/* eslint-disable */
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent extends LangComponent implements OnInit {
    // userInfo: IUserInfo;
    title: string = this.message("prc.register.title");
    field_Name: string = this.getMessage('field_Name');
    field_Phone: string = this.getMessage('field_Phone');
    field_VertifyCode: string = this.getMessage('field_VertifyCode');
    field_Location: string = this.getMessage('field_Location');
    field_Birthday: string = this.getMessage('field_Birthday');
    field_MediaType: string = this.getMessage('field_MediaType');
    field_MediaName: string = this.getMessage('field_MediaName');
    field_Responsible: string = this.getMessage('field_Responsible');
    field_Responsible_des: string = this.getMessage('field_Responsible_des');
    field_Interested: string = this.getMessage('field_Interested');
    field_Interested_des: string = this.getMessage('field_Interested_des');
    btnRequest: string = this.getMessage('btnRequest');
    provinceStr: string = this.message("prc.provinceStr");
    btnGetStr: string = this.getMessage("btnGet");
    cityStr: string = this.message("prc.cityStr");
    monthStr: string = this.message("prc.monthStr");
    dayStr: string = this.message("prc.dayStr");
    province: object = [];
    city: object = [];
    month: object = [
        { id: 1, value: "01" },
        { id: 2, value: "02" },
        { id: 3, value: "03" },
        { id: 4, value: "04" },
        { id: 5, value: "05" },
        { id: 6, value: "06" },
        { id: 7, value: "07" },
        { id: 8, value: "08" },
        { id: 9, value: "09" },
        { id: 10, value: "10" },
        { id: 11, value: "11" },
        { id: 12, value: "12" }
    ];
    day: object = [];
    selectProvince: object = {};
    selectCity: object = {};
    selectProvinceCode: string = "110000";
    selectCityCode: string = "110100";
    selectMonth: number = 1;
    selectDay: number = 1;
    selectMediaType: object = null;
    selectBirthDayMonth: number = 2;
    selectBirthDayDay: number = 5;
    userName: string = "";
    mobilePhone: string = "";
    mobilePhoneDisplay: string = this.formatMobilePhone(this.mobilePhone);
    vertifyCode: string = "";
    mediaName: string = "default media";
    responsible: string = "Charge";
    userType: number | string = "";
    loadProvince: boolean = false;
    loadCity: boolean = false;
    loadBaseInfo: boolean = false;
    isShowLoading: boolean = true;
    isSendSMSDiabled: boolean = null;
    constructor(
        private appService: AppService,
        private pinYinService: PinYinService,
        private router: Router,
        private userInfo: clsUserInfo,
        public typeData: clsRegisterType
    ) {
        super();
    }
    ngOnInit(): void {
        this.userInfo = this.appService.getUserInfo();
        this.userType = this.userInfo['userType'];
        if (this.userType === undefined || this.userType === null || this.userType.toString().length <= 0) {
            this.router.navigate(['prc', 'start']);
        }
        if (this.userInfo.userID > 0 && this.userInfo.status == 1) {
            this.btnRequest = this.getMessage("btnModify");
        } else {
            this.btnRequest = this.getMessage('btnRequest');
        }
        this.appService.getProvince().then((data: Response) => {
            if (data.status == 200) {
                const provinceData = data.json();
                for (const key in provinceData) {
                    if (this.local === 'en') {
                        let provinceName = provinceData[key]['name'];
                        provinceName = provinceName !== undefined || provinceName !== null ? provinceName.toString() : '';
                        provinceData[key]['name'] = this.getPinYin(provinceName);
                    }
                    if (provinceData[key]['code'] == this.selectProvinceCode) {
                        this.selectProvince = provinceData[key];
                    }
                }

                this.province = provinceData;
                this.getCity();
            }
            this.loadProvince = true;
            this.checkLoading();
        }).catch((err) => {
            console.log(err);
            this.loadProvince = true;
            this.checkLoading();
        });
        this.appService.getBaseList().then((res: Response) => {
            if (res.status === 200) {
                const mData = res.json();
                const userData = this.appService.getUserInfo();
                this.typeData.addMediaType(mData['mediaType']);
                this.typeData.addWineType(mData['wineType']);
                if (this.typeData && this.typeData["wineType"]) {
                    for (const wKey in this.typeData["wineType"]) {
                        const tmpData = this.typeData["wineType"][wKey];
                        const tmpValue1 = this.message(`prc.register.${tmpData.value1}`);
                        const tmpValue2 = this.message(`prc.register.${tmpData.value2}`);
                        this.typeData["wineType"][wKey]['isChecked'] = false;
                        this.typeData["wineType"][wKey]['value1'] = tmpValue1 || tmpData.value1;
                        this.typeData["wineType"][wKey]['value2'] = tmpValue2 || tmpData.value2;
                        if (userData.wineType) {
                            for (const oW of userData.wineType) {
                                const id1 = parseInt(tmpData['value_id']);
                                const id2 = parseInt(oW.toString());
                                if (id1 == id2) {
                                    this.typeData["wineType"][wKey]['isChecked'] = true;
                                }
                            }
                        }
                    }
                }
                if (this.typeData && this.typeData['mediaType']) {
                    const vKey = this.local === 'zh' ? 'value1' : 'value2';
                    const mtKeys = Object.keys(this.typeData["mediaType"]);
                    mtKeys.map((mKey) => {
                        const tmpMediaType = this.typeData["mediaType"][mKey];
                        this.typeData["mediaType"][mKey]['typeName'] = tmpMediaType[vKey];
                        if (userData.mediaType) {
                            const id1 = parseInt(tmpMediaType['value_id']);
                            const id2 = parseInt(userData.mediaType.toString());
                            if (id1 === id2) {
                                this.selectMediaType = tmpMediaType;
                            }
                        }
                    });
                }
            }
            this.loadBaseInfo = true;
            this.checkLoading();
        }).catch((err) => {
            console.log(err);
            this.loadProvince = true;
            this.checkLoading();
        });
        this.setDefaultUserInfo();
        const myDay = [];
        for (let i = 0; i < 31; i++) {
            const tmpDay = i < 9 ? `0${i + 1}` : i + 1;
            myDay.push({ id: i + 1, value: tmpDay });
        }
        this.day = myDay;
    }
    getPinYin(value: string): string {
        return this.pinYinService.ConvertPinyin(value);
    }
    getCity(): void {
        const selectProv = this.selectProvince || this.province[0];
        if (selectProv !== null && selectProv['code'] && selectProv['code'].length > 0) {
            const code = selectProv['code'];
            if (this.loadBaseInfo && this.loadCity && this.loadProvince) {
                this.isShowLoading = true;
            }
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
                this.checkLoading();
            }).catch((err) => {
                this.loadCity = true;
                this.checkLoading();
                console.log(err);
            });
        }else {
            this.loadCity = true;
        }
    }
    checkLoading() {
        if (this.loadBaseInfo && this.loadCity && this.loadProvince) {
            this.isShowLoading = false;
        } else {
            this.isShowLoading = true;
        }
    }
    getMessage(key: string): string {
        return this.message(`prc.register.${key}`);
    }
    provinceChange(): void {
        this.city = [];
        this.getCity();
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
    mediaTypeClick(value): void {
        this.selectMediaType = value;
    }
    favClick(value): void {
        value['isChecked'] = !value['isChecked'];
    }
    setDefaultUserInfo(): void {
        const userData = this.appService.getUserInfo();
        this.userName = userData.userName;
        this.mobilePhone = userData.mobilePhone;
        this.selectBirthDayMonth = userData.birthMonth ? parseInt(userData.birthMonth.toString()) : 0;
        this.selectBirthDayDay = userData.birthDay ? parseInt(userData.birthDay.toString()) : 0;
        this.mediaName = userData.mediaName;
        this.responsible = userData.responsible;
        this.selectProvinceCode = userData.province;
        this.selectCityCode = userData.city;
    }
    submitClick(): void {
        const data = {
            userName: this.userName,
            mobilePhone: this.mobilePhone,
            vertifyCode: this.vertifyCode,
            province: this.selectProvince['code'],
            city: this.selectCity['code'],
            birthMonth: this.selectBirthDayMonth,
            birthDay: this.selectBirthDayDay,
            mediaType: this.selectMediaType ? this.selectMediaType['value_id'] : '',
            mediaName: this.mediaName,
            responsible: this.responsible,
            wineType: []
        };
        const wineType = this.typeData['wineType'];
        const selectedWine = [];
        Object.keys(wineType).map((wKey)=>{
            const wType = wineType[wKey];
            if (wType.isChecked) {
                selectedWine.push(wType.value_id);
            }
        });
        data.wineType = selectedWine;
        this.isShowLoading = true;
        this.appService.updateUserInfo(data).then((res: Response) => {
            this.isShowLoading = false;
            if (res.status == 200) {
                const result = res.json();
                if (result['success']) {
                    if (this.userInfo['userID'] > 0 && this.userInfo.status == 1) {
                        alert(this.getMessage('updateSuccess'));
                    } else if(this.userInfo.userID>0 && this.userInfo.status != 1 && (this.userType !== UserType.MediaUser)) {
                        this.router.navigate(['prc','finish']);
                    } else if(this.userInfo.userID>0 && this.userInfo.status != 1 && this.userType == UserType.MediaUser) {
                        this.router.navigate(['prc','status']);
                    }
                } else {
                    alert(result['info']);
                }
            }
        }).catch((err) => {
            this.isShowLoading = false;
        });
    }
    inputChange(event, key): void {
        this[key] = event;
    }
    sendSMS():void{
        this.isShowLoading = true;
        this.appService.sendSMSCode(this.mobilePhone)
            .then((data)=>{
                this.isShowLoading = false;
                if(data['success']){
                    this.isSendSMSDiabled = true;
                    const timeOut = 60;
                    let timIndex = timeOut;
                    const tim = () =>{
                        if(timIndex<= 1) {
                            this.isSendSMSDiabled = null;
                            this.btnGetStr = this.getMessage("btnGet");
                            return;
                        }else {
                            timIndex--;
                            this.btnGetStr = `${timIndex}s`;
                            setTimeout(tim,1000);
                        }
                    };
                    new tim();
                }else {
                    alert(data['info']);
                }
            }).catch((err)=>{
                this.isShowLoading = false;
                alert(err);
            });
    }
}