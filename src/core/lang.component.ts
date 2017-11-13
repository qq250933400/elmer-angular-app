import { zh, en } from '../config/index';
import { CoreComponent } from './core.component';
const tempLanguage = {
    en: {
        'app.home.win8.title': 'SystemManger',    
        'app.home.win8.loginout': 'Login Out',
        ...en
    },
    zh: {
        'app.home.win8.title': '系统管理',
        'app.home.win8.loginout': '注销',
        ...zh
    }
};

export class LangComponent extends CoreComponent {
    data: object = {};
    curData: object = {};
    local = 'zh';
    isMerged = false;
    constructor() {
        super();
        const lang = window.sessionStorage && window.sessionStorage.getItem('local');
        this.data = tempLanguage;
        this.local = lang !== undefined && lang !== null && lang.length > 0 ? lang : 'zh';
        this.curData = this.data[this.local];
        this.mergeFromGlobal();
    }
    setLanguage(key:string, refresh: boolean = false):void{
        if(window.sessionStorage) {
            window.sessionStorage.setItem("local",key);
            refresh && window.location.reload(true);
        }else {
            throw new Error("Setting the language's local is error,please upgrade your browser");
        }
    }
    message(key: string): string {
        if(!this.isMerged) {
            this.mergeFromGlobal();
        }
        if (key !== undefined || key !== null && key.length > 0) {
            if (key.indexOf('.') <= 0) {
                return this.curData[key] || key;
            } else {
                return this.getTreeMessage(key);
            }
        } else {
            return 'Gey the undefined key';
        }
    }
    getTreeMessage(key: string): string {
        const mArr = key.split('.');
        let tmpData = this.curData;
        for(const key in mArr) {
            const value = mArr[key];
            const tData = tmpData[value];
            if (tData !== undefined && tData !== null){
                tmpData = tData;
            }
        }
        if(tmpData !== undefined && tmpData !== null && this.isString(tmpData)) {
            return tmpData.toString();
        } else {
            return key;
        }
    }
    mergeFromGlobal() {
        const tmpData = window['language'] || {};
        for (const key in tmpData) {
            this.mergeNode(this.data[key], tmpData[key]);
            this.isMerged = true;
        }
    }
    mergeNode(target: object,src: object) {
        if (src) {
            for(const key in src) {
                let tmpData = src[key];
                const mType = Object.prototype.toString.call(tmpData);
                if ( mType === '[object Object]') {
                    this.mergeNode(target[key], tmpData);
                } else if (mType === '[object String]' || mType==='[object Number]'){
                    target[key] = tmpData
                }
            }
        }
    }
}
