//IAppViewport


Ext.define("sef.core.interfaces.IAppViewport", {
    showLogin: function() {
        //console.log('will show login now', this);
    },

    _makeLayout: function() {
        return null;
    },
    makeTipBar:function(forRegin){
        var lay= {
            xtype:'box',
            cls:'sef-global-tipbar',
            html:'系统将要更新',
            hidden:true,
            bind:{
                hidden:'{!sys_will_update}',
                html:'{sys_update_tip}'
            }
        }
        if(forRegin===true){
            lay['region']='north';
        }
        return lay;
    }
});