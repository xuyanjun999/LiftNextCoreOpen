Ext.define('abp.component.form.AbpFormCtl', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.abpformctl',
<<<<<<< HEAD

    routes : {
        'form/:id' : 'onUsers'
    },

    control: {
        'button[action]': {
            click: 'onActionButtonClick',
        },
        '#':{
            activate:'onactivate'
=======
    control:{
          'button[action]':{
            click:'onActionButtonClick',
>>>>>>> 40118efc8b0728767e5259ad4f4af7b6a1199a39
        }
    },

    onUsers:function(id){
        console.log("onUsers",id);
    },
    onactivate: function () {
        console.log('onactivate',this.getView().formPage);
    },

<<<<<<< HEAD
    onActionButtonClick: function (actionBtn) {
        var me = this;
        var actionName = actionBtn.action;
        var view = me.getView();
        var actionFunName = Ext.String.format('on{0}_excute', actionName);
        if (Ext.isFunction(view[actionFunName])) {
            var fun = view[actionFunName];
=======
    getHashObj: function () {
        var me = this;
        var view = me.getView();
        var hashObj = view.formPage.appPage.hashObj;
        return hashObj;
    },
    onback_excute: function () {
        debugger
        var me = this;
        var hashObj = me.getHashObj();
        var hashJson = Ext.apply(hashObj, {
            viewName: 'list'
        });

        this.redirectTo(Ext.Object.toQueryString(hashJson));
        //abp.msg.success('success');
        //this.getView().fireEvent('switchPage',1,'abc');
    },

    onActionButtonClick:function(actionBtn){
        var me=this;
        var actionName=actionBtn.action;
        var view=me.getView();
        var actionFunName=Ext.String.format('on{0}_excute',actionName);
        if(Ext.isFunction(view[actionFunName])){
            var fun=view[actionFunName];
>>>>>>> 40118efc8b0728767e5259ad4f4af7b6a1199a39
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

    onread_excute: function () {
        var me = this;
        me.read();
    },

    read: function (id) {
        var view = this.getView();
        var form = view.getForm();
        var url = Ext.String.endsWith(view.url, '/') ? view.url + 'read' : view.url + '/read';
        abp.utils.ajax({
            url: url,
            jsonData: {
                id: id
            },
            success: function (retObj, response, opts) {
                if (retObj.Success) {
                    var model = Ext.create(view.model);
                    model.set(retObj.Entitys[0]);
                    form.loadRecord(model);
                } else {
                    abp.msg.error(retObj.Message);
                }
                view.unmask();
            },
            failure: function (form, action) {
                console.log('error', response);
                abp.msg.error('通讯错误');
                view.unmask();
            }
        });
        view.mask('正在读取中...');

    },

    oncreate_excute: function () {
        var view = this.getView();
        var form = this.getView().getForm();

        if (!form.isDirty()) {
            abp.msg.warn('没有修改数据，不需要保存。');
            return;
        } else if (!form.isValid()) {
            abp.msg.warn('有必填项没有填写，请先填写所有必填项。');
            return;
        }

        var url = Ext.String.endsWith(view.url, '/') ? view.url + 'create' : view.url + '/create';
        var formValue = form.getValues();
        var jsonData = {
            Entity: formValue
        };
        abp.utils.ajax({
            url: url,
            jsonData: jsonData,
            success: function (retObj, response, opts) {
                if (retObj.Success) {
                    var model = Ext.create(view.model);
                    model.set(retObj.Entitys[0]);
                    form.loadRecord(model);
                    abp.msg.toast('保存成功!');
                } else {
                    abp.msg.error(retObj.Message);
                }
                view.unmask();
            },
            failure: function (response) {
                console.log('error', response);
                abp.msg.error('通讯错误');
                view.unmask();
            }
        });
        view.mask('正在保存中...');

    },

    onupdate_excute: function () {
        var view = this.getView();
        var form = this.getView().getForm();

        if (!form.isDirty()) {
            abp.msg.warn('没有修改数据，不需要保存。');
            return;
        } else if (!form.isValid()) {
            abp.msg.warn('有必填项没有填写，请先填写所有必填项。');
            return;
        }
        var url = Ext.String.endsWith(view.url, '/') ? view.url + 'update' : view.url + '/update';
        var formValue = form.getValues();
        abp.utils.ajax({
            url: url,
            jsonData: formValue,
            success: function (retObj, response, opts) {
                if (retObj.Success) {
                    var model = Ext.create(view.model);
                    model.set(retObj.Entitys[0]);
                    form.loadRecord(model);
                } else {
                    abp.msg.error(retObj.Message);
                }
                view.unmask();
            },
            failure: function (response) {
                console.log('error', response);
                abp.msg.error('通讯错误');
                view.unmask();
            }
        });
        view.mask('正在保存中...');
<<<<<<< HEAD
    },

    onback_excute: function () {
        console.log('back', this);
        this.getView().fireEvent('switchPage', 0);
=======
>>>>>>> 40118efc8b0728767e5259ad4f4af7b6a1199a39
    }
});