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
        //this.getView().fireEvent('switchPage',1,'abc');
    },

    

});