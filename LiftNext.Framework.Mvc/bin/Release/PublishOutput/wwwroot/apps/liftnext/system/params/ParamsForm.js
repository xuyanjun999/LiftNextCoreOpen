//UserForm

Ext.define('sef.app.liftnext.system.params.ParamsForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-paramsform',



    bars: [sef.runningCfg.BUTTONS.SAVE,
        sef.runningCfg.BUTTONS.EDIT_INFORM,
        sef.runningCfg.BUTTONS.DEL_INFORM
    ],

    activate__execute: function(btn) {
    },

    onPageReady: function() {

        //console.log('formpage will on ready');
        //此方法用于更新权限信息
        //roles为子表名称，若不加则为主表的行为
        this.updatePermission({
            paramscompare_create : true
        });
    },



    //用于子表的按钮事件，若返回了false则系统内置的行为全部被屏蔽
    //标准子页面按钮事件名称为 [子列表名称(name)]_[按钮名称(name)]__execute
    blockparams_import__execute: function(btn) {
        //console.log('will process for create', btn, this);
        var me = this;
        if (!this._dialog) {
            this._dialog = Ext.create('sef.core.components.window.LookupDialog', { //SEF.core.view.security.LoginDialog', {
                //url: url

                closeAction: 'hide',
                quickSearch: this.quickSearch,
                store: {
                    type: 'sef-store',
                    url: '/mock/company.json',
                    //autoLoad:true,
                    model: 'sef.app.liftnext.system.block.BlockParamModel',

                    additionFilterFn: function() { //此方法用于增加store的其它查询参数
                        //console.log('addition#',this);
                        return {
                            DD: 1024
                        };
                    }
                },
                columns: ['Name', 'Code'],
                quickSearch: ['Name', 'Code']
                    //columns: me.columns

            });
            this._dialog.on('dialogclose', function(state, result) {
                //console.log('export dialog will close#', state, result);
                if (result.Result) {
                    var rec = result.Result[0];
                    //added to list's store
                    
                } else {

                }

                this.updateLayout();
            }, me);
        }

        this._dialog.show();
        return false;
    },

    items: [{
        name: 'Code',
        fieldLabel: _('编号'),
        allowBlank: false
    }, {
        name: 'Name',
        fieldLabel: _('名称'),
        allowBlank: false
        }, {
            name: 'ParamClass',
            fieldLabel: _('类别'),
            value : '基础参数'
    }, {
        name: 'DataType',
        fieldLabel: _('数据类型'),
        xtype: 'sef-enumcombo',
        enumType: 'SEF.Core.Common.DataTypeEnum,SEF.Core.Common',
        value:'string'
        }, {
            name: 'DigitNum',
            fieldLabel: _('小数位数'),
            xtype: 'numberfield',
            allowDecimals: false,
            value : 0
    }, {
        name: 'UseType',
        fieldLabel: _('使用类型'),
        xtype: 'sef-enumcombo',
        enumType: 'SEF.Core.Common.UseTypeEnum,SEF.Core.Common',
        value :0
        }, {
        name: 'ImgUrl',
        fieldLabel: _('图示'),
        columnWidth: 1
    }, {
        xtype: 'textarea',
        name: 'DefaultValue',
        fieldLabel: _('可选值(逗号分隔)'),
        columnWidth: 1
    } ,{
        xtype: 'textarea',
        name: 'Desc',
        fieldLabel: _('描述'),
        columnWidth: 1
    }]
});