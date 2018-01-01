Ext.define('abp.component.form.AbpForm', {
    extend: 'Ext.form.Panel',
    xtype:'abpform',
    config: {
        formPage:null,
        needBackBtn: true,

    },
    requires: [
        'abp.component.form.AbpFormCtl'
    ],
    controller:'abpformctl',
    layout:'column',
    makeTbar: function () {
        var me = this;
        var tbar = me.tbar || [];
        if (me.needBackBtn) {
            tbar.push({
                text: '返回',
                action: 'back'
            });
        }
        return tbar;
    },
    makeDefaults:function(){
        var me=this;

        if(!me.defaults){
            me.defaults={
                labelAlign:'top',
                margin:'5px 10px',
                xtype:'textfield',
                columnWidth:0.25
            }
        }
        return me.defaults;
    },

    makeForm: function () {
        var me=this;
        var cfg={};
        Ext.apply(cfg,{
            tbar:me.makeTbar(),
            defaults:me.makeDefaults()
        });
        return cfg;
    },

    initComponent: function () {
        var me = this;
        Ext.apply(me, me.makeForm());
        me.callParent();

    }
})