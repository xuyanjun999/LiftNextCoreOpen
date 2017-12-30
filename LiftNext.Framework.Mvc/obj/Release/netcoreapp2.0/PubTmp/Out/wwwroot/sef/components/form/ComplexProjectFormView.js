Ext.define('sef.core.components.form.ComplexProjectFormView', {
    extend: 'sef.core.components.form.ComplexProjectForm',
    // mixins: ['Ext.util.StoreHolder'],
    //extend: 'sef.core.components.form.AbstractDynamicFormPanel',
    xtype: 'sef-complexprojectformview',
    watchFieldChange: false,
    updateTipInfo: true,

    config: {
        currentStep : ''
    },

    initComponent: function() {
        this.callParent(arguments);
    },

    makeParamLayout: function(result, items) {
        //console.log('all items#',items);
        //设置梯号下级节点
        var me = this;
        Ext.each(items, function (item) {
            var layout = Ext.JSON.decode(item.Layout);
            //debugger;
            if (item.CustomNode === false) {
                //debugger;
                me.updateSectionLayout(item, layout.Layout, false);
                me.updateFormData(item, item.Params);
                me.bindFormBlurEvent(item);
            } else {
                //add custom layout
                if (item.Layout) {
                    me.makeCustomLayout(item, layout);
                    me.updateFormData(item, item.Params);
                }
            }
        });
    },


    //makeCommonItems: function(items, data) {


    //    //debugger;

    //    if (!Ext.isArray(items)) items = [items];

    //    var cf = this.down('#commonForm');
    //    cf.removeAll();
    //    cf.add(items);
    //    return;

    //},

    makeParamFormLayout: function (items) {
        items.forEach(function (f) {
            delete f['xtype'];
        });
        var f=this.callParent([items]);
        f['onlyForView']=true;
        return f;
    },

    makeCommonFormLayout:function(){
        var form=this.callParent(arguments);
        form['onlyForView']=true;
        return form;
        
    },

    makeCustomLayout: function(item, layout) {
        //console.log('id#',item.Code);
        if (!layout) return;
        var me = this;
        var items = [];
        var groups = [];
        var code = item.Code;


        //更新布局
        var cardId = 'card_' + code;
        var form = this._formCard.down('#' + cardId);
        //console.log(cardId,form);
        if (form) {
            //wirll remove
            form.destroy();
            //this._formCard.remove(form, true);
            form = null;
            delete from;
        }
        if (!form) {
            Ext.apply(layout, {
                formCode: code,
                //editMode: undefined,
                recId: item.ID,
                //scrollable: false,
                //height:1000,
                itemId: cardId,
                listeners: {
                    'afterrender': function() {
                        me.onCustomLayoutReady(item);
                    }
                }
            });

            this._formCard.add(layout);
            //console.log(f,f.editMode);

        }
        //console.log('rec is#',rec);

        //console.log('will updateing layout#',code,lc,groups,items);
    },

    onCustomLayoutReady: function(item) {
        console.log('custom layout ready#', item, this);
    }
});