//CardPanel.js

Ext.define('sef.core.components.CardPanel',{
    extend:'Ext.panel.Panel',
    xtype:'sef-cardpanel',
    ui:'sefu-cardpanel',
    border:true,
    config:{
        loading:null,
        headerLine:false
    },

    initComponent:function(){
        if(this.headerLine===true){
            Ext.apply(this,{
                cls:'line'
            });
        }
        this.callParent(arguments);
    }
});