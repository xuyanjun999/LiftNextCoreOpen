//SearchField.js

Ext.define('sef.core.components.form.SearchField', {
    extend: 'Ext.form.field.Text',
    xtype: 'sef-searchfield',
    cls: 'sef-searchfield',

    emptyText: 'search',
    triggers: {
        clear: {
            cls: 'x-fa fa-times',
            hidden: true,
            handler: 'onClearClick',
            scope: 'this',
            weight: 0,
            tooltip: _('清除搜索条件')
        },

        search: {
            weight: 10,
            cls: 'x-fa fa-search',
            handler: 'onSearchClick',
            scope: 'this',
            tooltip: _('快速查询')
        },
        filter: {
            weight: 20,
            hidden:true,
            cls: 'x-fa fa-filter',
            handler: 'onShowAdvSearch',
            scope: 'this',
            tooltip: _('高级搜索')
        }
    },

    privates: {
        _dialog: null
    },

    config: {
        model: null,
        //quickSearch:null,/* ['Name'],*/
        advSearch: null,/*['Code', 'Name', 'Customer', 'ContractNo', 'UploadDate', {
            name: 'test11111',
            fieldLabel: 'for test',
            xtype: 'numberfield'
        }],*/
        allowCustomSearch: true,
        dialogWidth:600,
        dialogHeight:400,
    },

    onClearClick: function() {
        var me = this;
        me.getTrigger('clear').hide();
        me.setValue('');
        me.updateLayout();
        //this.fireEvent('search', v);
        me.fireEvent('quicksearch', me.getValue());
        me.fireEvent('search', me.getValue());
    },
    onSearchClick: function() {
        var me = this;
        me.getTrigger('clear').show();
        me.updateLayout();
        me.fireEvent('quicksearch', me.getValue(),false);
        me.fireEvent('search', me.getValue(),false);
    },

    onShowAdvSearch: function() {
        var me = this;
        if (!this._dialog) {
            this._dialog = Ext.create('sef.core.components.window.AdvSearchDialog', { //SEF.core.view.security.LoginDialog', {
                //url: url
                width:this.dialogWidth,
                height:this.dialogHeight,
                closeAction: 'hide',
                model:this.model,
                advSearch:this.advSearch,
                allowCustomSearch:this.allowCustomSearch

            });
            this._dialog.on('dialogclose', function(state, result) {
                //console.log('export dialog will close#', state, result);
                this.fireEvent('search', result.length>0 ? result : null,true);
            }, me);
        }

        this._dialog.show();
    },

    initComponent: function() {
        //this.debug(arguments);
        //debugger;
        this.callParent(arguments);
        //this.setUI('searchbox');
        var me = this;
        me.on('specialkey', function(f, e) {
            if (e.getKey() == e.ENTER) {
                me.onSearchClick();
            }
        });
        if(me.advSearch){
            me.getTrigger('filter').show();
            me.updateLayout();
        }

    },
    onDestroy: function() {
        if (this._dialog) {
            //debugger;
            this._dialog.destroy();
            this._dialog = null;
            delete this._dialog;
        }
        return this.callParent(arguments);
    }
});