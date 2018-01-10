//包含左边树以及右侧高级查询的List页面
Ext.define('abp.view.main.Form', {
    extend: 'abp.component.page.FormPage',
    xtype: 'mainform',
    form: {
        xtype:'abpform',
        model:'abp.model.sys.Menu',
        url:'/menu',
        items:[{
            xtype:'textfield',
            name:'Name',
            fieldLabel:'名称',
            value:''
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
            value:''
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
        }],
        tbar:[{
            text:'保存',
            action:'create'
        }]
    }, //form
});