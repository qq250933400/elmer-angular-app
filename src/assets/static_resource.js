window.language = {
    en: {
        app_title:"Media Club",
        prc: {
            start: {
                mediaType: "Media/KOL",
                wineLovers: "Drink Lover",
                tipText:"This is your first login Pernod-Ricard Media Club, select your identity"
            },
            register: {
                title:"Refine your personal information, let us know more about you",
                field_Name: "Name：",
                field_Phone: "Mobile：",
                field_VertifyCode: "Verification Code：",
                field_Location: "City：",
                field_Birthday: "Birthday：",
                field_MediaType: "Media Type：",
                field_MediaName: "Media Name：",
                field_Responsible: "Responsible section",
                field_Responsible_des: "Separated by ，",
                field_Interested: "Prefer",
                field_Interested_des: "Multiple Choice",
                btnRequest: "Apply",
                btnModify: "Update",
                btnGet: "Receive",
                updateSuccess:"Done",
                requestSuccess:"Done",
                Brandy: "Brandy",
                BrandyDescription: "Brany Culture",
                Whisky: "Whisky",
                WhiskyDescription: "Chivas，Ballantine，Royal Salute，Glenlivet",
                WhiteSpirit:"White Spirit",
                WhiteSpiritDescription:"Absolut，Havana Club",
                champagne: "Champagne",
                champagneDescription: "Perrier Jouet，Mumm，etc.",
                Winery:"Wine",
                WineryDescription: "Jacob's Creek etc."
            },
            status: {
                statusText: "Under administrator review...",
                tipText: "We already received your submitted request, administrator is on the way to review, please wait.",
                scanTip:"Please long press following QR code to follow us, when finish review, we will inform you through Wechat"
            },
            finish:{
                tipText: "Thank you for your support of Pernod-Ricard. If you like us, please long press following QR code to follow us",
            },
            detail:{
                sourceTitle:"Material：",
                linkTitle:"Link：",
                pwdTitle:"Password：",
                btnGetSource:"Achieve Material",
                btnGetMessage:"More Infomation",
                btnSend:"Send",
                btnSendLink:"Receive by email",
                emailPlaceHolder:"email",
                sendSuccess:"Done",
                sendFaild:"Send Field. Please retry later",
                btnSubmit:"Apply",
                moreInfoHolder:"Please describe more details",
                moreInfoEmail:"Please tell us your email."
            },
            news:{
                selectTip:"Please choose the news",
                editEmail: "Edit"
            },
            provinceStr: "Province",
            cityStr:"City",
            monthStr:"Month",
            dayStr:"Day",
            latestnews:"Latest News",
            allNews: "All News"
        },
        loading: "Loading…",
        gotop: "Top"
    },
    zh: {
        prc:{
            register: {
                Brandy: "干邑",
                BrandyDescription: "马爹利",
                Whisky: "威士忌",
                WhiskyDescription: "芝华士，百龄坛，皇家礼炮，格兰威特等",
                WhiteSpirit:"白色烈酒",
                WhiteSpiritDescription:"绝对伏特加，哈瓦那俱乐部",
                champagne: "香槟",
                champagneDescription: "巴黎之花、玛姆等",
                Winery:"葡萄酒",
                WineryDescription: "杰卡斯等"
            }
        }
    }
};
window.elmer = {
    debug            : true,
    loginToActivity  : true,
    dev: {
        baseURL      : "http://localhost/media/",
        loginURL     : "http://localhost/media/index.php?m=Prc&c=Index&a=index"
    },
    prod: {
        baseURL      : "http://tmall.dmeww.com/prcmedia/",
        loginURL     : "http://tmall.dmeww.com/prcmedia/index.php?m=Prc&c=Index&a=index"
    }
};

//when resource file loaded raise event to call angular method to reload config
typeof window.setConfig === 'function' && window.setConfig();
typeof window.setLangConfig === 'function' && window.setLangConfig();
