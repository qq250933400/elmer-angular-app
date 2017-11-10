import { baseConfig } from '../config/base';
import { IConfig } from '../interface/config.interface';
export class CoreComponent {
    config: IConfig = <IConfig>baseConfig;
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
    addEvent (oElement, sEvent, fnHandler) {
        oElement.addEventListener ? oElement.addEventListener(sEvent, fnHandler, false) : oElement.attachEvent(['on', sEvent].join(''), fnHandler);
    }
    removeEvent (oElement, sEvent, fnHandler) {
        oElement.removeEventListener ? oElement.removeEventListener(sEvent, fnHandler, false) : oElement.detachEvent(['on', sEvent].join(''), fnHandler);
    }
    setCss(element, property, value) {
        element.style[property] = value;
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
    setCss3 (sender, property, value) {
        if (Object.prototype.toString.call(property) === '[object String]' && property.length > 0 && sender) {
            const exArr = property.match(/_([a-zA-Z0-9])/g);
            let newProperty = property;
            if (exArr && exArr.length > 0) {
                exArr.map((splitCode) => {
                    newProperty = newProperty.replace(splitCode, splitCode.replace('_', '').toUpperCase());
                });
            }
            const mProperty = [newProperty.substr(0, 1).toUpperCase(), newProperty.substr(1)].join('');
            const webkitProperty = ['webkit', mProperty].join('');
            const mozProperty = ['moz', mProperty].join('');
            const msProperty = ['ms', mProperty].join('');
            const oProperty = ['o', mProperty].join('');
            if (sender.style[newProperty] !== undefined) {
                sender.style[newProperty] = value;
            } else if (sender.style[webkitProperty] !== undefined) {
                sender.style[webkitProperty] = value;
            } else if (sender.style[mozProperty] !== undefined) {
                sender.style[mozProperty] = value;
            } else if (sender.style[msProperty] !== undefined) {
                sender.style[msProperty] = value;
            } else if (sender.style[oProperty] !== undefined) {
                sender.style[oProperty] = value;
            }
        }
    }
    supportCss3 (style) {
        const prefix = ['webkit', 'Moz', 'ms', 'o'];
        const humpString = [];
        const htmlStyle = document.documentElement.style;
        const _toHumb = (string) => {
            return string.replace(/-(\w)/g, ($0, $1) => {
                return $1.toUpperCase();
            });
        };

        for (const i in prefix) {
            humpString.push(_toHumb(prefix[i] + '-' + style));
        }
        humpString.push(_toHumb(style));
        for (const key in humpString) {
            if (humpString[key] in htmlStyle) {
                return true;
            }
        }
        return false;
    }
    getUriParam (keyWords) {
        const queryString = window.location.search || '';
        const newQuery = queryString.replace(/^\?/, '').replace(/#.*?/, '');
        const queryArr = newQuery.split('&');
        let result = null;
        for (const key in queryArr) {
            const tmpQuery = queryArr[key];
            const tmpSearch = tmpQuery.match(/^(.*?)=(.*?)$/);
            if (tmpSearch && tmpSearch.length > 2 && keyWords.toLowerCase() === tmpSearch[1].toLowerCase()) {
                result = tmpSearch[2];
            }
        }
        return result;
    }
    getUriHash(keyWords) {
        const hashQuery = window.location.hash;
        const newQuery = hashQuery.replace(/^#/, '');
        const queryArr = newQuery.split('&');
        let result = null;
        for (const key in queryArr) {
            const tmpQuery = queryArr[key];
            const tmpSearch = tmpQuery.match(/^(.*?)=(.*?)$/);
            if (tmpSearch && tmpSearch.length > 2 && keyWords.toLowerCase() === tmpSearch[1].toLowerCase()) {
                result = tmpSearch[2];
            }
        }
        return result;
    }
    getDecodeURI (value) {
        return decodeURIComponent(value);
    }
    getEncodeURI (value) {
        return encodeURIComponent(value);
    }
    /**
     * 给指定元素添加样式
     * @param {DomElement} sender 操作对象
     * @param {string} className 样式名称
     * @return {null} 没有返回值
     */
    addClass (sender, className) {
        if (this.isDomElement(sender)) {
            sender.classList.add(className);
        } else if (this.isNodeList(sender)) {
            for (const key in sender) {
                const tmpElement = sender[key];
                this.isDomElement(tmpElement) && tmpElement.classList.add(className);
            }
        }
    }

    /**
     * 从Dom移除class
     * @param {DomElement} sender Dom对象 
     * @param {string} className 样式名称
     * @return {null} 没有返回
     */
    removeClass (sender, className) {
        if (this.isDomElement(sender)) {
            sender.classList.remove(className.split(' '));
        } else if (this.isNodeList(sender)) {
            for (const key in sender) {
                const tmpElement = sender[key];
                this.isDomElement(tmpElement) && tmpElement.classList.remove(className);
            }
        }
    }

    /**
     * 设置Dom属性值
     * @param {DomElement} sender Dom对象 
     * @param {string} property 属性名称 
     * @param {string|number} value 属性值
     * @return {null} nothing
     */
    setAttr (sender, property, value) {
        if (this.isDomElement(sender)) {
            sender.setAttribute(property, value);
        }
    }

    /**
     * 获取原DOM属性值
     * @param {DomElement} sender Dom对象 
     * @param {string} property 属性名称
     * @return {string|number} 属性值
     */
    getAttr (sender, property) {
        if (this.isDomElement(sender)) {
            return sender.getAttribute(property);
        } else {
            return null;
        }
    }
    hasClass (sender, className) {
        if (this.isDomElement(sender)) {
            return sender.classList.contains(className);
        } else {
            return false;
        }
    }
    /**
     * 获取指定Dom的父元素
     * @param {DomElement} sender Dom对象 
     * @param {string} queryString 查询字符串
     * @return {DomElement} 返回elment
     */
    getParentElement (sender, queryString) {
        if (this.isDomElement) {
            if (this.isString(queryString) && queryString.length > 0) {
                let parent = sender.parentElement;
                const queryArr = queryString.split(',');
                while (parent) {
                    for (const key in queryArr) {
                        const tmpQuery = queryArr[key];
                        const tmpMatch = tmpQuery.match(/([a-zA-Z]*)\[([a-zA-Z=]*)\]/);
                        if (/^\./.test(tmpQuery)) {
                            if (this.hasClass(parent, tmpQuery.replace(/^\./, ''))) {
                                return parent;
                            }
                        } else if (/^#/.test(tmpQuery)) {
                            if (this.getAttr(parent, 'id') === tmpQuery.replace(/^#/, '')) {
                                return parent;
                            }
                        } else if (tmpMatch && tmpMatch[1].toUpperCase() === parent.tagName) {
                            return parent;
                        } else if (tmpQuery.toUpperCase() === parent.tagName) {
                            return parent;
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        return null;
    }
    animationEnd(sender:Element,callBack:Function):void{
        this.addEvent(sender,"animationEnd",callBack);
        this.addEvent(sender,"webkitAnimationEnd",callBack);
        this.addEvent(sender,"mozAnimationEnd",callBack);
        this.addEvent(sender,"msAnimationEnd",callBack);
    }
    removeAnimationEnd(sender:Element,callBack:Function):void{
        this.removeEvent(sender,"animationEnd",callBack);
        this.removeEvent(sender,"webkitAnimationEnd",callBack);
        this.removeEvent(sender,"mozAnimationEnd",callBack);
        this.removeEvent(sender,"msAnimationEnd",callBack);
    }
}
