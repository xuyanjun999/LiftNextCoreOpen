//FormPanel.js

Ext.define('sef.core.components.form.FormPanel', {
    extend: 'Ext.form.Panel',
    xtype: 'sef-formpanel',
    scrollable: 'y',
    bodyPadding: '0 10px 20px 10px',
    cls: 'sef-formpanel',
    layout: 'column',
    _defaults: {
        columnWidth: .25,
        margin: '0 10px 5px 10px',
        xtype: 'textfield',
        labelAlign: 'top',
        labelSeparator: ''
    },
    _onlyViewDefaults:{
        columnWidth: .25,
        margin: '0 5px 0px 5px',
        xtype: 'displayfield',
        labelAlign: 'left',
        labelWidth:80,
        labelSeparator: ''
    },
    privates:{
        _scroll:null,
        _scrollTop:0
    },
    defaultExcludeForViewMode: 'sef-datagridfield,',
    excludeForViewMode: '',

    config: {
        trackScrollable:false,
        onlyForView:false,
        editMode: undefined //0为view,1为edit
    },

    updateRecord: function(rec) {
        var f = this.callParent(arguments);
        if (rec) {
            //debugger;
            var fields = rec.getFields();
            fields.forEach(function(f) {
                if (f.stype === 'asso') {

                    //debugger;
                    var name = f.name + (window.SEF_LIB_CFG.assoFieldSplitChar||'')+ 'ID';
                    var fsv=rec.get(f.name);
                    var fv=0;
                    if(fsv){
                        if(Ext.isObject(fsv)){
                            fv=fsv['ID'];
                        }else{
                            fv=fsv;
                        }
                    } else {
                        fv = rec.get(name);
                    }
                    rec.set(name,fv );
                }
            });
        }

        return f;
    },


    makeTBar: function() {
        return null;
    },

    makeBackButton: function() {
        return {
            xtype: 'sef-actionbutton',
            btnType: 'flat',
            iconCls: 'x-fa fa-arrow-left',
            tooltip: _('返回'),
            actionName: 'back'
        };
    },

    makeRecButtons: function() {
        var bars = [{
            xtype: 'label',
            hidden: true,
            bind: {
                html: '{curRecIndex+1}/{totalRec}',
                hidden: '{!rec_label}'
            }
        }];
        bars.push({
            xtype: 'sef-actionbutton',
            disabled: true,
            btnType: 'flat',
            tooltip: _('上一条'),
            actionName: 'rec_prev',
            iconCls: 'x-fa fa-angle-left',
            bind: {
                disabled: '{!rec_prev}'
            }
        });
        bars.push({
            xtype: 'sef-actionbutton',
            btnType: 'flat',
            disabled: true,
            actionName: 'rec_next',
            tooltip: _('下一条'),
            //disabled:true,
            iconCls: 'x-fa fa-angle-right',
            bind: {
                disabled: '{!rec_next}'
            }
        });
        return bars;
    },




    makeContent: function() {
        //var items=[];
        var dfts = Ext.merge({}, this.defaults);
        Ext.applyIf(dfts, {
            columnWidth: .333333,
            margin: '0 10px 5px 10px',
            xtype: 'textfield',
            labelAlign: 'top'
        });
        //delete this.defaults;

        var c = {
            //layout: 'column',
            defaults: dfts
        };



        return c;
    },

    setFieldDisplayMode: function(field, mode) {
        var me = this,
            ftype = field.xtype;
        if (me.defaultExcludeForViewMode.indexOf(ftype + ',') >= 0) return;
        if (me.excludeForViewMode.indexOf(ftype + ',') >= 0) return;
        //if (!field['getValue']) return;
        //console.log(field,field instanceof sef.core.interfaces.IFieldDisplayModeChange);
        if (Ext.isFunction(field.changeDisplayMode)){// instanceof sef.core.interfaces.IFieldDisplayModeChange) {
            field.changeDisplayMode(mode);
            return;
        }

        //console.log(field,ftype,mode);
        if (field instanceof Ext.form.FieldContainer) {
            //debugger;
            field.items.each(function(f) {
                me.setFieldDisplayMode(f, mode);
            });
            return;
        } 



        if (!(field instanceof Ext.form.field.Base)) return;

        if (mode === 1) {
            if (field._lastDisabled === true) {
                field.setDisabled(true);
            } else {
                field.setDisabled(false);
            }
        } else {
            field._lastDisabled = field.disabled;
            field.setDisabled(true);
        }

    },

    switchMode: function(newMode) {
        //console.log(this.name,this.id,this.editMode);
        if (this.editMode === false) return;

        if (newMode === this.editMode) {
            return;
        }

        var me = this,
            items = this.items;
        items.each(function(field, index) {

            //console.log(field.name,field.xtype,field);

            //this.connection instanceof Ext.data.Connection
            me.setFieldDisplayMode(field,newMode);

            
            //console.log(field.name,field.xtype,field.disabled);
        });

        if (newMode === 0) {
            this.addCls('sef-form-onlyview');
        } else {
            this.removeCls('sef-form-onlyview');
        }
        if (Ext.isFunction(this.onViewModeChange)) {
            this.onViewModeChange.call(this, this.editMode, newMode);
        }
        this.editMode = newMode;


    },

    makeDynamicContent: function(content, withGroup) {
        //console.log('#######',content);
        //if(withGroup)
        this.removeAll(true);
        this.add(content);
        //this.items.addAll(content);
    },

    scrollToElement:function(itemId,withManual){
        var el;
        //console.log(itemId);
        if(Ext.isString(itemId)){
            el=this.down('#'+itemId).getEl();
        }else{
            el=itemId;
        }

        if(withManual !==true){
            el.scrollIntoView(this.getEl());
            return;
        }
        
        //debugger;
        var ct=this.getEl().dom;
        //var scroll=this.getScrollable();
        var dom=el.dom,scrollY=this._scrollTop;
        var offsets=el.getOffsetsTo(ct),
        height = dom.offsetHeight,
        top = offsets[1] + scrollY,
        bottom = top + height,
        viewHeight = ct.clientHeight,
        viewTop = scrollY,
        viewBottom = viewTop + viewHeight;

        //viewRight = viewLeft + viewWidth;
        
        //console.log('dom.h:',height,'el.off.h:',offsets[1],'viewh:',viewHeight,scrollY);
        var newY=offsets[1]+scrollY;
        if(newY != scrollY){
            this._scroll.scrollTo(0,newY,true);
        }
        

        
    },


    initComponent: function() {
        var me=this,tbar = this.makeTBar();
        if (tbar) {
            Ext.apply(this, {
                //scrollable:'y',
                tbar: tbar
            });
        }
        var dfts = this.onlyForView === true ? this._onlyViewDefaults : this._defaults;
        Ext.apply(dfts, this.defaults || {});
        Ext.apply(this.defaults)
        //Ext.apply(this.d)
        Ext.apply(this,{
            cls: this.onlyForView === true ? 'sef-formpanel form-onlyforview' : 'sef-formpanel',
            defaults: dfts
        });
        Ext.apply(this, this.makeContent());



        this.on('formsuccess', function (form, rec, result) {
            if (Ext.isFunction(this.onAfterSave)) {
                this.onAfterSave.call(this, rec, result);
            }
        });

        this.callParent(arguments);
        if(this.trackScrollable===true){
            if(!this._scroll){
                this._scroll=this.getScrollable();
                this._scroll.on('scrollend',function(s,x,y){
                    //console.log('scroll.end#',y);
                    me._scrollTop=y;
                });
            }
        }
        //this.switchMode(0);
    }
});