//包含左边树以及右侧高级查询的List页面
Ext.define('abp.view.sys.menu.Form', {
    extend: 'abp.component.page.FormPage',
    xtype: 'menuform',
    form: {
        xtype:'abpform',
        items:[{
            xtype:'textfield',
            name:'Name',
            fieldLabel:'名称',
            value:'xuyanjun'
        },{
            xtype:'textfield',
            name:'Code',
            fieldLabel:'编号',
            value:''
        },{
            xtype:'textfield',
            name:'Url',
            fieldLabel:'Url',
            value:''
        },{
            xtype:'textfield',
            name:'Name1',
            fieldLabel:'名称',
            value:'xuyanjun'
        },{
            xtype:'textfield',
            name:'Code1',
            fieldLabel:'编号',
            value:''
        },{
            xtype:'textfield',
            name:'Url1',
            fieldLabel:'Url',
            value:''
        }]
    }, //form
});