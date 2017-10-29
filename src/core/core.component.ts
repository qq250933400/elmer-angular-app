export class CoreComponent {
    getType(value: any): string {
        return Object.prototype.toString.call(value);
    }
    isString(value: any): boolean {
        return this.getType(value) === '[object String]';
    }
    formatMobilePhone(phone:string) : string{
        if (/^1[0-9]{10}$/.test(phone)){
            return [phone.substr(0,3),phone.substr(3,4),phone.substr(7)].join('-');
        } else {
            return phone;
        }
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
}
