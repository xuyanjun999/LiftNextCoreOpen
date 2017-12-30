//User.js

Ext.define('sef.app.liftnext.block.Block', {
    extend: 'sef.core.view.appcontainer.AppPageContainer',
    xtype: 'sef-blocklib',
    title: '块资源库',
    closable: true,
    requires: [
        'sef.app.liftnext.system.block.BlockModel',
        'sef.app.liftnext.block.BlockView'
        //'sef.app.liftnext.system.customer.UserModel'
    ],
    //用于指定当前页面默认显示的vname，与下面的views中的vname相对应
    defaultView:'view',
   
    //若单独指定model则页面在加载完成时会自动生成一个store
    model: 'sef.app.liftnext.system.block.BlockModel',

    //用于MODEL在加载数据时对应的url地址
    //正式使用时应该是 /api/user
    api: '/Block',

    additionFilterFn:function(){
    },
    
    //store:
    views: [{
        //用于在列表和表单之间的切换
        vname:'view',
        xtype: 'sef-blockview'
    }],

    //加上此节点用于显示标准树
    tree:{
        //此属性用于控制是否显示checkhbox
        //enableCheck:true,
        xtype:'sef-pagetree',
        
        title:'块分类',
        //用于加载树的url
        url:'/Block/GetTree'
    },

    onTreeItemClick: function (tree, record) {
        tree.up('sef-blocklib').down('sef-blockview').store.makeQuerys({
            FieldName: 'BlockGroup', Values: [record.data.Data]
        });
    },
    

    initComponent: function() {
        this.callParent(arguments);
        //console.log(this.store);
        
    }
});