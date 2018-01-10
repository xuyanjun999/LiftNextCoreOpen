Ext.define('abp.util.Message', {
    success: function (message) {
        Ext.Msg.show({
            title: '成功',
            message: message,
            buttons: Ext.Msg.YES,
            icon: Ext.Msg.INFO,
        });
    },
    error: function (message) {
        Ext.Msg.show({
            title: '错误',
            message: message,
            buttons: Ext.Msg.YES,
            icon: Ext.Msg.ERROR,
        });
    },
    warn: function (message) {
        Ext.Msg.show({
            title: '警告',
            message: message,
            buttons: Ext.Msg.YES,
            icon: Ext.Msg.WARNING,
        });
    },
    question: function (message, cb) {
        Ext.Msg.show({
            title: '请确认',
            message: message,
            buttons: Ext.Msg.YESNOCANCEL,
            icon: Ext.Msg.QUESTION,
            fn: cb
        });
    },
    toast:function(message,title,align,iconCls){
        title=title||'消息';
        align=align||'t';
        Ext.toast(message, title, align, iconCls);
    }
    
},function(cls){
    //console.log('cls',cls)
    if(!abp.msg) abp.msg=new cls();
});