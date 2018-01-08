export interface IConfig{
    imageServerURL?: string;
};
export interface IExConfigURL {
    baseURL?  : string,
    loginURL? : string
};
export interface IExConfig {
    debug?  : boolean,
    dev?: IExConfigURL,
    prod?: IExConfigURL,
    loginToActivity?: boolean;
};