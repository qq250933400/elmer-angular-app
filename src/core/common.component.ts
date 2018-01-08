
export class CommonComponent {
    getType(value: any): string {
        return Object.prototype.toString.call(value);
    }
    isString(value: any): boolean {
        return this.getType(value) === '[object String]';
    }
    isArray (value) {
        return this.getType(value) === '[object Array]';
    }
    isNumber (value) {
        return this.getType(value) === '[object Number]';
    }
    isObject (value) {
        return this.getType(value) === '[object Object]';
    }
    isDomElement(value) {
        return /^(\[object)\s{1}(HTML)[a-zA-Z]*(Element\])$/.test(this.getType(value));
    }
    isNodeList (value) {
        return this.getType(value) === '[object NodeList]';
    }
    isFunction (value) {
        return this.getType(value) === '[object Function]';
    }
    isMobile (value) {
        const userAgent = value || window.navigator.userAgent.toString();
        return /(iPhone|Android)/.test(userAgent);
    }
    isiPad (value) {
        const userAgent = value || window.navigator.userAgent.toString();
        return /(iPad)/.test(userAgent);
    }
    extend(des,src){
        if (Object.assign){
            Object.assign(des, src);
        } else {
            this.assign(des, src);
        }
    }
    assign(target: object,src: object) {
        if (src) {
            for(const key in src) {
                let tmpData = src[key];
                const mType = Object.prototype.toString.call(tmpData);
                if ( mType === '[object Object]') {
                    this.assign(target[key], tmpData);
                } else if (mType === '[object String]' || mType==='[object Number]'){
                    target[key] = tmpData
                }
            }
        }
    }
    isNull(obj:any): boolean{
        if(obj === undefined || obj === null) {
            return true;
        }else {
            if((this.isString(obj) || this.isNumber(obj)) && obj.toString().length<=0){
                return true;
            }
        }
        return false;
    }
}