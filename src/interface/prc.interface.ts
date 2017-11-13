export interface IRegsiterTypeData {
    mediaType: object,
    wineType: object
}

export class clsRegisterType implements IRegsiterTypeData{
    mediaType: object;
    wineType: object;
    addMediaType(value: object):void{
        this.mediaType = value;
    }
    addWineType(value: object): void{
        this.wineType = value;
    }
}

export interface IUserInfo {
    userType: number|string,
    userID: number,
    userName: string,
    mobilePhone: string,
    vertifyCode: string,
    province: string,
    city: string,
    birthMonth: number,
    birthDay: number,
    mediaType: string,
    mediaName: string,
    responsible: string,
    wineType: number[]
};
export class clsUserInfo  implements IUserInfo {
    userType: number | string;
    userID: number;
    userName: string;
    mobilePhone: string;
    vertifyCode: string;
    province: string;
    city: string;
    birthMonth: number;
    birthDay: number;
    mediaType: string;
    mediaName: string;
    responsible: string;
    wineType: number[];
    status: number;
}

export interface ISwapper {
    alt?: string;
    url?: string;
    index?: number;
    imageUrl: string;
    title: string;
}

export class clsSwappe implements ISwapper {
    alt?: string;
    url?: string;
    index?: number;
    imageUrl: string;
    title: string;
}

interface INewsImageInfo{
    title?   :string;
    alt?     :string;
    url      :string;
    imgUrl   :string;
}
export interface INewsInfo{
    title: string;
    date: string;
    titleImageUrl: string;
    description: string;
    isChecked?: boolean;
    images?: INewsImageInfo[];
}

export class clsNewsInfo implements INewsInfo{
    title: string;
    date: string;
    titleImageUrl: string;
    description: string;
    isChecked?: boolean = false;
    detailUrl?:string;
    id?:number;
    images?: INewsImageInfo[] = new Array<INewsImageInfo>();
}

export interface IResponseData {
    success: boolean;
    info: string;
    data?: object
}

export interface INewsListItem {
    newsID: number;
    title?:string;
    headImage?:string;
    typeName?:string;
    type?:number;
    description?:string;
    createDate?:string;
    
}

export const UserType = {
    NormalUser: 'NormalUser',
    MediaUser:'MediaUser',
    WineLover: 'WineLover'
};
