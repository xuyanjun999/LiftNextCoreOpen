//UserForm

Ext.define('sef.app.liftnext.system.block.BlockForm', {
    extend: 'sef.core.components.page.FormPage',
    xtype: 'sef-blockform',



    bars: [sef.runningCfg.BUTTONS.SAVE,
        sef.runningCfg.BUTTONS.EDIT_INFORM,
        sef.runningCfg.BUTTONS.DEL_INFORM,
        {
            text: '审核',
            xtype: 'sef-actionbutton',
            btnType: 'default',
            actionName: 'activate'
        }, {
            text: '撤销',
            xtype: 'sef-actionbutton',
            btnType: 'default',
            actionName: 'cancel'
        }, {
            text: '同步',
            xtype: 'sef-actionbutton',
            btnType: 'default',
            actionName: 'synchro'
        }
    ],

    activate__execute: function(btn) {
        //console.log('here is activate click#', btn, this);
        var form = this;
        sef.dialog.confirm(_('确认审核选中的数据?'), '', function () {
            form.setLoading("Loading...");
            sef.utils.ajax({
                url: 'Block/ActivateBlock',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    blockIds: [form.recID]
                },
                scope: form,
                success: function (result) {
                    sef.message.success("已成功加入任务队列", 3000);
                    form.setLoading(false);
                },
                failure: function (err, resp) {
                    sef.dialog.error(err.message);
                    form.setLoading(false);
                    console.log('error', err);
                }
            });
        });
    },

    cancel__execute: function (btn) {
        //console.log('here is activate click#', btn, this);
        var form = this;
        sef.dialog.confirm(_('确认撤销选中的数据?'), '', function () {
            form.setLoading("Loading...");
            sef.utils.ajax({
                url: 'Block/CancelBlock',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    blockIds: [form.recID]
                },
                scope: form,
                success: function (result) {
                    sef.message.success("已成功加入任务队列", 3000);
                    form.setLoading(false);
                },
                failure: function (err, resp) {
                    sef.dialog.error(err.message);
                    form.setLoading(false);
                    console.log('error', err);
                }
            });
        });
    },

    synchro__execute: function (btn) {
        var form = this;
        sef.dialog.confirm(_('确认要同步所有涉及梯型的块参数?'), '', function () {
            form.mask();
            sef.utils.ajax({
                url: 'Block/SynchroModelBlock',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    blockId: form.recID
                },
                scope: form,
                success: function (result) {
                    //console.log(result)
                    if (result.length > 0) {
                        sef.dialog.info({
                            list: result
                        });
                    } else {
                        sef.message.success("同步成功", 3000);
                    }
                    form.unmask();
                },
                failure: function (err, resp) {
                    sef.dialog.error(err.message);
                    form.unmask();
                    console.log('error', err);
                }
            });
        });
    },

    onPageReady: function() {
        //console.log('formpage will on ready');
        //此方法用于更新权限信息
        //roles为子表名称，若不加则为主表的行为
        this.updatePermission({
            activate: true,
            cancel: true,
            synchro: true
        });
    },

    onRecordChange: function(rec) {
        if (rec != null) {
            var avatar = this.down('#avatar');
            avatar.setSrc(rec.get("Thumbnail"));
            //console.log('will set avatar value#',avatar);
        }
    },

    onBeforeSave: function(data) {
        //data.LoginName="hello,jeff";
        //console.log('will cancel saveing...#', data);
        //return false;//
    },

    items: [{
            xtype: 'container',
            columnWidth: .3,
            layout: {
                type: 'vbox',
                align: 'middle',
                pack: 'center'
            },
            margin: '6px 0 0 0',
            items: {
                xtype: 'sef-avatar',
                itemId: 'avatar',
                uploadUrl: '/Block/UploadImg',
                onGetUploadParams: function () {
                    var form = this.up('sef-blockform');
                    return { blockId: form.recID };
                },
                onUploadComplete: function () {
                    sef.message.success("图片上传成功", 3000);
                    var form = this.up('sef-blockform');
                    form.loadRecordById(form.recID);
                }
            }
        }, {
            name: 'Code',
            fieldLabel: _('代号'),
            allowBlank: false,
            readOnly: true,
            columnWidth: .35
        }, {
            name: 'Name',
            fieldLabel: _('名称'),
            allowBlank: false,
            readOnly: true,
            columnWidth: .35
        }, {
            name: 'BlockGroup',
            fieldLabel: _('所属组'),
            xtype: 'sef-lookupfield',
            columns: ['KeyName', 'KeyValue', {
                name: 'KeyDef1',
                text:'编号'
            }, 'KeyDes'],
            simpleValue: true,
            colConfig: [],
            quickSearch: ['KeyValue'],
            displayField: 'KeyValue',
            valueField: 'KeyValue',
            allowBlank: false,
            columnWidth: .35,
            store: {
                type: 'sef-store',
                url: '/GlobalParam',
                //autoLoad:true,
                model: 'sef.app.liftnext.system.global.GlobalParamModel',
                additionFilterFn: function () {
                    return [{ filterFieldName: 'KeyName', Values : ['块分组']}]
                }
            }
        },  {
            name: 'InsertPosition',
            fieldLabel: _('插入次序'),
            xtype: 'sef-enumcombo',
            enumType: 'SEF.Core.Common.InsertPositionEnum,SEF.Core.Common',
            columnWidth: .35,
            value : 0
        }, {
            xtype: 'sef-subtitle',
            columnWidth: 1,
            title: _('块规则维护')
        }, {
            xtype: 'textarea',
            name: 'InsertPointX',
            fieldLabel: _('插入点坐标X'),
            columnWidth: 0.5,
            allowBlank: false,
            value : '0'
        }, {
            xtype: 'textarea',
            name: 'InsertPointY',
            fieldLabel: _('插入点坐标Y'),
            columnWidth: 0.5,
            allowBlank: false,
            value: '0'
        }, {
            xtype: 'textarea',
            name: 'ExInsertPointX',
            fieldLabel: _('额外插入点坐标X'),
            columnWidth: 0.5,
            value: ''
        }, {
            xtype: 'textarea',
            name: 'ExInsertPointY',
            fieldLabel: _('额外插入点坐标Y'),
            columnWidth: 0.5,
            value: ''
        },  {
            xtype: 'textarea',
            name: 'BlockConfig',
            fieldLabel: _('选取规则'),
            columnWidth: 1
        }, {
            itemId:'BlockParams',
            name: 'BlockParams',
            columnWidth: 1,
            xtype: 'sef-datagridfield',
            title: _('块参数'),
            quickSearchFields: ['ParamDefine.Code','ParamDefine.Name'],
            bars: ['EDIT'],
            assoField: 'BlockID',
            colConfig: [{
                name: 'DrawingType',
                width: 100
            }, {
                name: 'ParamDefine',
                renderer: sef.utils.relRenderer('Name'),
                width : 250
                }, {
                    dataIndex: 'ParamCode',
                    renderer: function (v, f, g) {
                        if (g.data.ParamDefine) {
                            return g.data.ParamDefine.Code;
                        }
                        return "";
                    },
                    index:3,
                    text:'参数编号',
                    width: 250
                },{
                    name: 'DefaultValue',
                    flex:1
                }],
            editor: {
                formType: 'sef-blockparamform',
                title: _('块参数管理')
            },
            store: {
                type: 'sef-store',
                url: '/BlockParam',
                include:['ParamDefine'],
                //autoLoad:true,
                model: 'sef.app.liftnext.system.block.BlockParamModel'
            }
        },  {
            name: 'CreateUser',
            fieldLabel: _('上传用户'),
            columnWidth: .3,
            readOnly: true
        }, {
            name: 'CreateDate',
            fieldLabel: _('上传日期'),
            xtype: 'datefield',
            columnWidth: .35,
            readOnly: true
        }, {
            name: 'AuditDate',
            fieldLabel: _('审核日期'),
            xtype: 'datefield',
            columnWidth: .35,
            readOnly: true
        }, {
            xtype: 'textarea',
            name: 'Desc',
            fieldLabel: _('描述'),
            columnWidth: 1,
            height: 40
        }, {
            xtype: 'textarea',
            name: 'ErrMsg',
            fieldLabel: _('日志'),
            columnWidth: 1,
            height: 40
        }
    ]
});