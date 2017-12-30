//Message.js

Ext.define('sef.core.utils.Dialog', {
    
    open:function(cfg){

    },

    formatContent:function(c){
        if(!c.list)return c;
        var lstMsg=[];
        c.list.forEach(function(cm){
            lstMsg.push('<div class="msg-line">'+cm+'</div>');
        });
        return "<div class='msg-multi-list'>"+lstMsg.join('')+"</div>";
    },

    show: function(cfg) {
        //console.log('will show a dialog#', cfg);
        var me=this,buttons=Ext.Msg.OK;
        if(cfg.type==='confirm'){
            buttons=Ext.Msg.YESNO;
        }
        if(cfg.type==='prompt' || cfg.type==='mprompt'){
            buttons=Ext.Msg.OKCANCEL;
        }

        if(Ext.isObject(cfg.message)){
            cfg.message=this.formatContent(cfg.message);
        }
        
        Ext.apply(cfg,{
            //icon: Ext.Msg.SUCCESS,
            title:sef.runningCfg.getTitle(),
            closable:false,
            buttons:buttons,
            fn:function(btn,value){
                //console.log('your clicked#',btn,value);
                if(btn==='ok' || btn==='yes'){

                    if(Ext.isFunction(cfg.onOK)){

                        cfg.onOK(value);
                    }
                }else if(Ext.isFunction(cfg.onCancel)){
                    cfg.onCancel.call();
                }
            }
        });

        Ext.Msg.show(cfg);
    }
}, function(dlgCls) {
    var types = ['success', 'error', 'warning', 'confirm','info','prompt','mprompt'];
    var dlg = new dlgCls();
    if (!sef.dialog) {
        sef.dialog = {};
        types.forEach(function(t) {
            sef.dialog[t] = function(content, title, onOK, onCancel,value) {
                if(t==='confirm'){
                    icon='QUESTION';
                }else{
                    icon=t;
                }
                //debugger;
                var cfg = {
                    type: t,
                    prompt:t==='prompt'||t==='mprompt',
                    multiline:t==='mprompt',
                    
                    icon:Ext.Msg[icon.toUpperCase()],
                    value:value,
                    title: title,
                    message: content,
                    onOK: onOK,
                    onCancel: onCancel
                };
                if(t==='mprompt'){
                    //cfg['minHeight']=250;
                }
                return dlg.show(cfg);
                //return dlg.Message(t, content, duration, onClose);
            }
        });
        sef.dialog.open=function(cfg){
            return dlg.open(cfg);
        }
    }
});