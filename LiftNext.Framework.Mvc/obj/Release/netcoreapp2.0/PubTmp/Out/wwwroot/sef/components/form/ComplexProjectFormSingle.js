//AbstractDynamicFormPanel

Ext.define('sef.core.components.form.ComplexProjectFormSingle', {
    extend: 'Ext.container.Container',
    // mixins: ['Ext.util.StoreHolder'],
    //extend: 'sef.core.components.form.AbstractDynamicFormPanel',
    xtype: 'sef-complexprojectformsingle',
    mixins: ['sef.core.interfaces.IFieldDisplayModeChange'],
    cls: 'sef-complexprojectform',
    config: {
        commonFormCollapsed: true,
        navTreeCommonNodeText: '合同信息',
        resultProperty: 'Result', //上述url返回的值存放的节点
        watchFieldChange: true,
        updateTipInfo: true
    },


    privates: {
        _id: 0,
        _formCard: null,
        _oriData: {},
        _editMode: null,
        _formLoaded: false
    },

    changeDisplayMode: function(newMode) {
        this._editMode = newMode;
        //console.log('will change to new mode#',newMode,this);
        this.updateEditMode();
    },

    updateEditMode: function() {
        if (this._formLoaded !== true) return;
        if (this._editMode === null || this._editMode === undefined) return;
        var me = this,
            forms = me.query('sef-formpanel');
        //console.log('will be update edit mode now');
        forms.forEach(function(f) {
            //console.log('form is#', f.formCode,me._editMode,f);
            //debugger;
            //if(f.editMode===false)return;
            f.switchMode(me._editMode);
        });
    },
    
    trackContainerScroll: function(x, y) {
        //console.log(x, y);
    },

    switchViewSection: function (section, index) {
        //console.log('will switch to new section#',section,index);
        var form = this.down('#card_' + section);
        var sub = 'subtitle_' + section + '_' + index;
        form.scrollToElement(sub, true);

        this.switchCardView(section);

    },

    switchCardView: function (code) {
        //console.log('will switch to new card#',code);
        var cardId = 'card_' + code;
        var form = this._formCard.down('#' + cardId);
        if (form) {
            this._formCard.getLayout().setActiveItem(form);
        }
    },

    makeCommonItems: function(items, data) {
        //debugger;

        if (!Ext.isArray(items)) items = [items];
        /*
        items = Ext.Array.insert(items, 0, [{
            xtype: 'sef-subtitle',
            itemId: 'headerSubTitle',
            columnWidth: 1,
            title: this.navTreeCommonNodeText
        }]);
        */

        //console.log('will set common items')
        var cf = this.down('#commonForm');
        cf.removeAll();
        cf.add(items);
        cf.editMode = undefined;
        if (data) {
            this._oriData['common'] = data;
            this.down('#commonForm').getForm().setValues(data);
        }
    },

    makeFormContent: function () {
        var me = this;
        return {
            xtype: 'container',
            flex: 1,
            itemId: 'formCard',
            //scrollable:'y',
            layout: {
                type: 'card',
                deferredRender: true
            }
        }
    },

    updateTip: function(code, rec) {
        //title:'<div class="text">合同信息</div>',
        if (this.updateTipInfo === false) return;
        this.down('#commonForm').setTitle(
            [
                '<div class="text">', this.navTreeCommonNodeText,
                '&nbsp;&nbsp;(当前选择[',
                rec.Text, ']</div>'
            ].join('')
        );


        //console.log(this.getValue());
    },

    makeContent: function() {
        return {
            xtype: 'container',
            cls: 'sef-main-content',

            flex: 1,

            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [this.makeCommonFormLayout(), this.makeFormContent()]
        }
    },

    makeCommonFormLayout: function() {
        return {
            xtype: 'sef-formpanel',
            itemId: 'commonForm',
            formCode: 'common',
            defaults: {
                columnWidth: 0.25
            },
            collapsible: true,
            collapsed: this.commonFormCollapsed,
            ui: 'sefu-formpanel-coll',
            title: '<div class="text">' + this.navTreeCommonNodeText + '</div>',
        };
    },

    onLoadData: function (me) {

    },

    loadData: function (result, reload) {
        
        var me = this;
        me.mask('loading...');
        this.suspendLayout = true;
        this._formLoaded = false;
        this._id = result.ProjectID;
        //debugger
        //重置树
        if (reload === true) {
           
            var allF = this.query('sef-formpanel');
            var fids = [];
            allF.forEach(function(f) {
                if (!f.formCode) return;
                if (f.formCode === 'common') return;
                f.destroy();
                f = null;
                delete f;
            });
        }
        var menus = [];
        var items = result.Children;
       
        ////设置合同信息
        var common_node = result.CommonNode;

        var common_layout = Ext.isString(common_node.Layout) ? Ext.JSON.decode(common_node.Layout) : common_node.Layout;
        if (common_layout && common_node.Params) {
            me.makeCommonItems(common_layout.Layout, common_node.Params);
        }
        //设置梯号下级节点
        me.makeParamLayout(result, items);
        
        me._formLoaded = true;
        me.updateEditMode();
        this.suspendLayout = false;
        this.updateLayout();
        me.unmask();
        //var ets=+new Date();
        //console.log('ComplexProjectForm.render times#',ets-ts);
    },

    makeParamLayout: function(result, items) {
        //console.log('all items#',items);
        //设置梯号下级节点
        var me = this;
        Ext.each(items, function (item) {
            var layout = Ext.isString(item.Layout) ? Ext.JSON.decode(item.Layout) : item.Layout;
            me.updateSectionLayout(item, layout.Layout);
            me.updateFormData(item, item.Params);
        });
    },
    
    updateSectionLayout: function(item, lc, autoExpand) {
        //console.log('id#',item.Code);
        if (!lc) return;
        var me = this;
        var items = [];
        var groups = [];
        var code = item.Code;
        lc.forEach(function(l, index) {
            groups.push({
                section: code,
                sectionIndex: index,
                //data:l.Group,
                text: l.Group,
                leaf: true,
                Text: l.Group,
                Leaf: true
            });
            items.push({
                xtype: 'sef-subtitle',
                title: l.Group,
                itemId: 'subtitle_' + code + '_' + index,
                //id: 'subtitle_' + code + '_' + index,
                columnWidth: 1
            });
            items = Ext.Array.merge(items, l.Items);
        });
        
        //console.log('menu.rec###',rec);
        debugger
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
            var f = this.makeParamFormLayout(items);
            Ext.apply(f, {
                formCode: code,
                recId: item.ID,
                itemId: cardId
            });
            //debugger;
            this._formCard.add(f);

        }
        //console.log('rec is#',rec);

        //console.log('will updateing layout#',code,lc,groups,items);
    },

    makeParamFormLayout: function(items) {
        return {
            xtype: 'sef-formpanel',
            trackScrollable: true,
            //formCode: code,
            editMode: undefined,
            //recId : item.ID,
            //scrollable: false,
            //height:1000,
            //itemId: cardId,
            defaults: {
                columnWidth: 0.25
            },
            items: items
        };
    },

    updateFormData: function(item, data) {
        var code = item.Code;
        this._oriData = this._oriData || {};
        this._oriData[code] = data;
        var cardId = 'card_' + code;
        var form = this._formCard.down('#' + cardId);
        if (form) {
            form.getForm().setValues(data);

            var floorfield = form.down('sef-floorfield');
            if (floorfield) {
                var tfloors = [];
                item.Floors.forEach(function(f) {
                    tfloors.push(f.FloorCode);
                });
                //debugger
                var index = 0;
                var tdatas = [];
                item.Floors.forEach(function(f) {
                    tdatas.push({
                        Index: index++,
                        Floor: f.FloorCode,
                        Value: f.FloorHeight,
                        Door: f.FloorDoor
                    });
                });
                floorfield.makeFloors({
                    floors: tfloors,
                    floorData: tdatas
                });
            }
        }
    },

    updateCommonData: function() {

    },

    getValue: function() {
        var me = this,
            forms = this.query('sef-formpanel');
        var allValues = [];
        forms.forEach(function(f) {
            //console.log(f.itemId);
            var v = f.getValues();
            //console.log(v)
            //allValues.push(v);
            //检查是否有修改
            var modified = [];
            var toChangeValues = {};
            var ov = me._oriData[f.formCode];
            if (ov) {
                for (fv in v) {
                    if (Ext.isArray(v[fv])) {
                        v[fv] = v[fv].join('');
                    }
                    //if(v[fv]===me._oriData[])
                    if (v[fv] !== ov[fv]) {
                        modified.push(fv);
                        toChangeValues[fv] = v[fv];
                    }
                }
            } else {
                toChangeValues = v;
                for (fv in v) {
                    modified.push(fv);
                }
            }


            allValues.push({
                Code: f.formCode,
                Values: v, //toChangeValues,
                Modified: modified
            });
            //allValues[f.formCode]=v;
            //Ext.merge(allValues, v || {});
        });

        return allValues;
    },

    setValue: function(code, v) {
        this.updateFormData(code, v);
    },

    initComponent: function() {

        Ext.apply(this, {
            layout: {
                type: 'hbox',
                align: 'stretch',
                pack: 'start'
            },
            items: [this.makeContent()]
        });
        this.callParent(arguments);
        this._formCard = this.down('#formCard');
        var me = this;
        this.on('afterlayout', function() {
            //me.mask('loading...');
            if (Ext.isFunction(this.onLoadData)) {
                this.onLoadData.call(this, this);
            }
            //console.log('for layout doing...');
        }, null, {
            single: true
        });
    },

    onDestroy: function() {
        this.callParent(arguments);
    }
});