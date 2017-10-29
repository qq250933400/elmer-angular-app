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