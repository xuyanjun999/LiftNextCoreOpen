window.____DEBUG___ = true;

window.SEF_LIB_CFG = {
    jsonWithPost: false,
   splashId: 'sef_splash',
    filterParam: 'Filter',
    limitParam: 'Limit',
    pageParam: 'Page',
    startParam: 'Start',
    sortParam: 'Sort',
    directionParam: 'SortDir',
    totalProperty: 'Count',
    successProperty: 'Success',
    rootProperty: 'Entitys',
    messageProperty: 'Message',
    pageTreeRootProperty: 'Entitys',
    messageApiRootProperty: 'Entitys',
    singleReadRootProperty: 'Entitys'
};


(function () {


    if (window.__sg__sef_runningcfg__) return;
    //console.log('will make a defualt config');
    window.__sg__sef_runningcfg__ = {
        Greeting:'欢迎你使用系统',//欢迎词
        Version: app_build_no,
        Name: "LN",
        Title: "LiftNext",
        CustomerLogo:'',//客户LOGO
        License: "FULL",
        LANG:'cn',
        EnableAd:false,//启用AD验证s
        Launch: "sef.core.view.security.LoginPage",
        DefaultUIMode: 'l-t',//l-t,t-b,t-b-s,
        LoadAppsOnce:false,//一次性加载所有APP，适用于内网环境
        DefaultToken:'Dashboard',
        Dashboard:'sef.app.liftnext.dashboard.DefaultDashboard',
        GridEmptyText:'<div class="grid-no-data">还没有数据，你可以添加或者更改查询条件</div>',
        ProfileApi:'/User/GetProfile',
        LoginApi: '/User/Login',
        LogoutApi: '/User/Logout',
        ChangePwdApi:'/mock/changepwd.json',
        MessageInterval:10,//消息任务的节拍，单位为秒钟
        MessageApi: '/Message/GetMyMessage',
        MessageHandleApi:'/Message/HandleMyMessage',
        UpdateLogUrl:'/apps/updatelog.json'
    };
})();

//console.log('here is running config');

function _(text){
    
    if(sef){
        var langCode='';
        if(sef.runningCfg){
            langCode=sef.runningCfg.getLang();
        }else{
            langCode=window.localStorage.getItem('__sef__ld__-LANG')
        }
        if(!langCode){
            langCode=window.__sg__sef_runningcfg__.LANG;
        }
        
        //console.log('new langCode#',langCode);
        var lang=sef.lang[langCode];
        var nt;
        if(lang){
            nt=lang[text];
        }
        //var nt=sef.lang[langCode]&&sef.lang[langCode].text;
        if(nt)return nt;
        
    }
    //console.log('lang#',text);
    return text;
}