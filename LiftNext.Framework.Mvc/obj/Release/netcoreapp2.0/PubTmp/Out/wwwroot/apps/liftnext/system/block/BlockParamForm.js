//UserForm

Ext.define('sef.app.liftnext.system.block.BlockParamForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-blockparamform',



    bars: [sef.runningCfg.BUTTONS.SAVE,
        sef.runningCfg.BUTTONS.EDIT_INFORM
    ],

    activate__execute: function(btn) {
        //console.log('here is activate click#', btn, this);
    },

    onPageReady: function() {

        //console.log('formpage will on ready');
        //此方法用于更新权限信息
        //roles为子表名称，若不加则为主表的行为
        this.updatePermission({

        });
    },



    items: [{
            name: 'ParamCode',
            fieldLabel: _('代号'),
            xtype: 'sef-lookupfield',
            columns: ['Code', 'Name'],
            quickSearch: ['Code', 'Name'],
            displayField: 'Name',
            allowBlank: false,
            store: {
                type: 'sef-store',
                url: '/app/liftnext/mock/company.json',
                //autoLoad:true,
                model: 'sef.app.liftnext.system.params.ParamsModel',
                additionFilterFn: function () { //此方法用于增加store的其它查询参数
                    //console.log('addition#',this);
                    return {
                        DD: 1024
                    };
                }
            }
        },{
            name: 'Name',
            fieldLabel: _('名称')
        }, {
            name: 'Status',
            fieldLabel: _('状态'),
            xtype: 'sef-enumcombo',
            enumType: 'SEF.Core.Common.TestEnum,SEF.Core.Common'
        }, {
            name: 'Category',
            fieldLabel: _('类别'),
            xtype: 'sef-enumcombo',
            enumType: 'SEF.Core.Common.TestEnum,SEF.Core.Common'
        },
        {
            name: 'Type',
            fieldLabel: _('类型'),
            xtype: 'sef-enumcombo',
            enumType: 'SEF.Core.Common.TestEnum,SEF.Core.Common'
        },
        {
            name: 'DefaultValue',
            fieldLabel: _('默认值')
        }, {
            xtype: 'textarea',
            name: 'Remark',
            fieldLabel: _('备注'),
            columnWidth: 1
        }
    ]
});