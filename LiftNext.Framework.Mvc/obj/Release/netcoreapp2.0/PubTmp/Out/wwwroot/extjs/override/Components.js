//
Ext.Component.override({
    mask: function (msg, msgCls, elHeight){
        msg=msg||'loading...';
        var newMsg='<div><div class="loading-cube"><span></span><span></span><span></span></div><div class="text">'+msg+'</div></div>';
        //debugger;
        this.callParent([newMsg,msgCls,elHeight]);
    }
});