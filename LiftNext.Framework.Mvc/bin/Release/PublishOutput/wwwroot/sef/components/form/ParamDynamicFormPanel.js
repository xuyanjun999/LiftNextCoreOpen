//AbstractDynamicFormPanel

Ext.define('sef.core.components.form.ParamDynamicFormPanel', {
    extend: 'Ext.container.Container',
    //extend: 'sef.core.components.form.AbstractDynamicFormPanel',
    xtype: 'sef-paramformpanel',
    layout: 'border',
    autoHeight: true,
    cls: 'sef-paramformpanel',

    //_partPoints: null,
    __scrollByMenu: false,
    __catagoryMenu: null,
    __catagroySize: 0,

    config: {
        url: ''
    },


    trackContainerScroll: function(x, y) {
        //return;
        //console.log('scroll y:', y);
        if (this.__scrollByMenu === true) {
            this.__scrollByMenu = false;
            return;
        }
        var prefixName = "subtitle_" + this.id + "_";
        var firstY, partIndex = -1;
        var p = this.down('#' + prefixName + '0'),
            el = p.getEl();
        var elB = el.getHeight();

        if (y <= elB) {
            partIndex = 0;

        } else {
            firstY = el.getBottom();
            partIndex = -1;
            for (var i = 1; i < this.__catagroySize; i++) {
                p = this.down("#" + prefixName + i);
                el = p.getEl();
                elB = el.getBottom();
                if ((y + firstY) <= elB) {
                    partIndex = i;
                    break;
                    //console.log('in view#panel_'+i,y,firstY,elB);
                    //return;
                }

            }
            if (partIndex < 0) partIndex = this.__catagroySize - 1;
        }
        //console.log('will update by store#', partIndex);
        this.updateMenuStore(partIndex);
        //console.log(partIndex,rec);



    },

    updateMenuStore: function(index) {
        //console.log('will udpate menu store#',index);
        if (this.__catagoryMenu === null) {
            this.__catagoryMenu = this.down('#catagoryMenu');
        }
        var me = this;
        this.__catagoryMenu.getStore().each(function(rec, ri) {
            var lc = rec.get('lastColor');
            if (!lc) {
                lc = 'gray';
            }
            if(lc==='checked'){
                lc='gray';
            }
            
            if (index === ri) {
                //var llc=rec.get('lastColor');
                rec.set('lastColor', rec.get('color'));
                rec.set('color', 'checked');
            } else {

                rec.set('color', lc);
            }
        });
    },

    scrollToPart: function(index) {
        this.__scrollByMenu = true;
        var prefixName = "subtitle_" + this.id + "_";
        var dom = Ext.fly(prefixName + index); //.getEl();

        var id = this.down('#formpanel-container').id;
        var formDomId = Ext.get(id + '-innerCt');
        var c = this.down('#formpanel-container').getEl();
        //console.log('will scroll#', dom,c);
        //debugger;
        dom.scrollIntoView(c, null, true);
        this.updateMenuStore(index);
    },

    loadForm: function() {
        //var url = this._rawData.ProfileApi;
        //console.log(url);
        var me = this;
        sef.utils.ajax({
            url: this.url,
            method: 'GET',
            //scope:this,
            success: function(result, resp) {
                //console.log(result);
                me.makeFormContent(result);
            },
            failure: function(err, resp) {
                //console.log('failure#',err,cb);
                //cb && cb(false, err);
            }
        });
    },

    getValue: function() {
        return this.getForm().getValues();
    },

    setValues: function(v) {
        return this.getForm().setValues(v);
    },

    getForm: function() {
        return this.down('#formpanel');
    },

    makeFormContent: function(result) {
        var catagory = [];
        var formResult = [];
        if (!Ext.isArray(result)) return;
        var me = this;
        result.forEach(function(grp, index) {
            catagory.push({
                text: grp.Group,
                index: index,
                color: index === 0 ? 'checked' : 'gray'
            });
            grp.Index = index;
            formResult.push({
                xtype: 'sef-subtitle',
                title: grp.Group,
                itemId: 'subtitle_' + me.id + '_' + index,
                id: 'subtitle_' + me.id + '_' + index,
                columnWidth: 1
            });
            formResult = Ext.Array.merge(formResult, grp.Items);
        });
        this.__catagroySize = catagory.length;
        this.down('#catagoryMenu').fillData(catagory);
        this.down('#formpanel').makeDynamicContent(formResult);
        return;
        var items = [];
        result.forEach(function(grp, index) {

            items.push({
                xtype: 'sef-subtitle',
                title: grp.Group,
                itemId: 'subtitle_' + me.id + '_' + index,
                id: 'subtitle_' + me.id + '_' + index
            });
            items.push({
                xtype: 'box',
                height: 400,
                html: 'here is grp#' + grp.Group
            });
        });
        this.down('#formpanel-container').items.get(0).add(items);
    },

    makeItems: function() {
        var me = this;
        var form = {
            xtype: 'sef-formpanel',
            itemId: 'formpanel',
            padding: 0,
            scrollable: false,
            columnWidth:1
        };
        var fc = {
            itemId: 'formpanel-container',
            xtype: 'container',
            region: 'center',
            padding: '0 0 0 20px',
            layout: 'column',
            scrollable: 'y',
            items: form,
            onScrollEnd: function(x, y) {
                //console.log('will move by x,y#',x,y);
                me.trackContainerScroll(x, y);
            }
        };
        return [{
                xtype: 'sef-timeline',
                itemId: 'catagoryMenu',
                region: 'west',
                listeners: {
                    'itemclick': function(v, rec, item, index) {
                        me.scrollToPart(index);
                        //console.log('clicked by index',index);
                    }
                }
            },
            fc
        ];
    },

    initComponent: function() {
        Ext.apply(this, {
            items: this.makeItems()
        });
        this.callParent(arguments);
        this.loadForm();

    },
    beforeRender:function(){
        
        
        this.st=+new Date();
        console.log('will beforrender',this.st);
        this.callParent(arguments);
    },
    afterRender:function(){
        
        this.callParent(arguments);
        console.log('will after beforrender',+new Date());
        var diff=(+new Date())-this.st;
        console.log('rending ts:',diff);
        //this.st=+new Date();
    }
});