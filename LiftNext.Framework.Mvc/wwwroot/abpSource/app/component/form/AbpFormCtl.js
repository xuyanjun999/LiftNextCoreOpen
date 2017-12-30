Ext.define('abp.component.form.AbpFormCtl',{
    extend:'Ext.app.ViewController',
    alias: 'controller.abpformctl',
    control:{
          'button[action]':{
            click:'onActionButtonClick',
        },
        '#':{
            'switchto':'onSwitchTo'
        }
    },
    onSwitchTo:function(record){
        console.log('onSwitchTo');
    },

    onActionButtonClick:function(actionBtn){
        var me=this;
        var actionName=actionBtn.action;
        var view=me.getView();
        var actionFunName=Ext.String.format('on{0}_excute',actionName);
        if(Ext.isFunction(view[actionFunName])){
            var fun=view[actionFunName];
            fun.call(view);
            return;
        }
        if(Ext.isFunction(me[actionFunName])){
            var fun=me[actionFunName];
            fun.call(me);
            return;
        }
        console.log(Ext.String.format('未找到对应的actionfunname:{0}',actionFunName));
    },

    onread_excute:function(){
        var me=this;
        me.read();
    },

    read: function (id) {
        var view=this.getView();
        var form=view.getForm();
        var url=Ext.String.endsWith(view.url,'/')?view.url+'read':view.url+'/read';
        abp.util.ajax({
            url:url,
            jsonData:{id:id},
            success: function (retObj,response, opts) {
                if(retObj.success){
                    var model=Ext.create(view.model);
                    model.set(retObj.result.entitys[0]);
                    form.loadRecord(model);
                }
                else{
                    abp.msg.error(retObj.message);
                }
                view.unmask();
            },
            failure: function (form, action) {
                console.log('error',response);
                abp.msg.error('通讯错误');
                view.unmask();
            }
        });
        view.mask('正在读取中...');
   
    },

    oncreate_excute: function () {
        var view=this.getView();
        var form = this.getView().getForm();

        if (!form.isDirty()) {
            abp.msg.warn('没有修改数据，不需要保存。');
            return;
        }
        else if (!form.isValid()) {
            abp.msg.warn('有必填项没有填写，请先填写所有必填项。');
            return;
        }
        var url=Ext.String.endsWith(view.url,'/')?view.url+'create':view.url+'/create';
        var formValue=form.getValues();
        abp.util.ajax({
            url:url,
            jsonData:formValue,
            success: function (retObj,response, opts) {
                if(retObj.success){
                    var model=Ext.create(view.model);
                    model.set(retObj.result.entitys[0]);
                    form.loadRecord(model);
                }
                else{
                    abp.msg.error(retObj.message);
                }
                view.unmask();
            },
            failure: function (response) {
                console.log('error',response);
                abp.msg.error('通讯错误');
                view.unmask();
            }
        });
        view.mask('正在保存中...');
       
    },

    onupdate_excute: function () {
        var view=this.getView();
        var form = this.getView().getForm();

        if (!form.isDirty()) {
            abp.msg.warn('没有修改数据，不需要保存。');
            return;
        }
        else if (!form.isValid()) {
            abp.msg.warn('有必填项没有填写，请先填写所有必填项。');
            return;
        }
        var url=Ext.String.endsWith(view.url,'/')?view.url+'update':view.url+'/update';
        var formValue=form.getValues();
        abp.util.ajax({
            url:url,
            jsonData:formValue,
            success: function (retObj,response, opts) {
                if(retObj.success){
                    var model=Ext.create(view.model);
                    model.set(retObj.result.entitys[0]);
                    form.loadRecord(model);
                }
                else{
                    abp.msg.error(retObj.message);
                }
                view.unmask();
            },
            failure: function (response) {
                console.log('error',response);
                abp.msg.error('通讯错误');
                view.unmask();
            }
        });
        view.mask('正在保存中...');
    },

    onback_excute:function(){
        console.log('back',this);
        this.getView().fireEvent('switchPage',0);
    }
});