Ext.define('abp.component.list.GridListCtl', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.gridlistctl',
    control: {
        'button[action]': {
            click: 'onActionButtonClick',
        }
    },
    onActionButtonClick: function (actionBtn) {
        var me = this;
        var actionName = actionBtn.action;
        var view = me.getView();
        var actionFunName = Ext.String.format('on{0}_excute', actionName);
        if (Ext.isFunction(view[actionFunName])) {
            var fun = view[actionFunName];
            fun.call(view);
            return;
        }
        if (Ext.isFunction(me[actionFunName])) {
            var fun = me[actionFunName];
            fun.call(me);
            return;
        }
        console.log(Ext.String.format('未找到对应的actionfunname:{0}', actionFunName));
    },
    getHashObj: function () {
        var me = this;
        var view = me.getView();
        var hashObj = view.listPage.appPage.hashObj;
        return hashObj;
    },
    oncreate_excute: function () {
        debugger
        var me = this;
        var hashObj = me.getHashObj();
        var hashJson = Ext.apply(hashObj, {
            viewName: 'form'
        });

        this.redirectTo(Ext.Object.toQueryString(hashJson));
        //abp.msg.success('success');
<<<<<<< HEAD
        this.getView().fireEvent('switchPage',1);
    },
    onedit_excute:function(){
        var me=this;
        var view=me.getView();
        var selection=view.getSelection();
        if(!Ext.isEmpty(selection)){
            abp.msg.error("请先选中数据!");
            return;
        }
        if(selection.length>1){
            abp.msg.error("最多只能选择一条数据!");
            return;
        }
        this.getView().fireEvent('switchPage',1,selection[0]);
        
    },
=======
        //this.getView().fireEvent('switchPage',1,'abc');
    },

    

>>>>>>> 40118efc8b0728767e5259ad4f4af7b6a1199a39
});