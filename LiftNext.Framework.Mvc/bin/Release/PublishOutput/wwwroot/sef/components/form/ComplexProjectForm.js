//AbstractDynamicFormPanel

Ext.define('sef.core.components.form.ComplexProjectForm', {
    extend: 'Ext.container.Container',
    // mixins: ['Ext.util.StoreHolder'],
    //extend: 'sef.core.components.form.AbstractDynamicFormPanel',
    xtype: 'sef-complexprojectform',
    mixins: ['sef.core.interfaces.IFieldDisplayModeChange'],
    cls: 'sef-complexprojectform',
    config: {
        contextMenuAddText: '添加项目',
        contextMenuEditCodeText: '修改项目号',
        contextMenuRemoveText: '删除项目',
        contextMenuEditCodePromptText: '输入新的项目号',

        contextMenuLoadParamText: '查看参数',
        contextMenuLoadBlockText: '查看块',
        contextMenuCalcParamText: '计算参数',
        contextMenuNonstdParamText: '非标参数',
        contextMenuValidParamText: '校验参数',
        contextMenuMarkDrawText: '生成图纸',
        contextMenuDownDrawText: '下载图纸',
        contextMenuUploadDrawText: '上传图纸',
        contextMenuReDesignText: '重新设计',
        contextMenuHistoryText: '历史版本',

        navTreeStoreIsLocal: true, //默认左边导航树的树的数据均基于memory，不使用远程加载
        navTreeUrl: '',
        navTreeCommonNodeText: '合同信息',

        projectCodePrefix: 'L', //梯号的前缀

        enableContextMenu: true,

        commonFormCollapsed: true,

        addUrl: '', //用于动态加载表单布局的地址
        changeCodeUrl: '', //更改梯号的地址
        removeUrl: '', //移除梯型的地址
        resultProperty: 'Result', //上述url返回的值存放的节点
        //projectData:[]
        contextMenuType: 'default',
        watchFieldChange: true,
        updateTipInfo: true,
        groupFieldShowMode: 'hide' //默认显示指定属性的字段,hide|show
    },


    privates: {
        _id: 0,
        _contextMenu: null,
        _menuStore: null,
        _formCard: null,
        _oriData: {},
        _editMode: null,
        _formLoaded: false
    },
    viewModel: {
        data: {}
    },

    changeDisplayMode: function(newMode) {
        this._editMode = newMode;
        //console.log('will change to new mode#',newMode,this);
        this.updateEditMode();
    },

    updateEditMode: function() {
        //debugger;
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

    showTreeContextMenu: function(rec, evt) {
        //console.log('will showing menu#',rec,evt);
        var me = this;
        if (!this._contextMenu) {
            this._contextMenu = Ext.create('Ext.menu.Menu', {
                items: this.makeTreeContextMenuItems(),
                listeners: {
                    click: function(menu, item) {
                        //console.log('will process scroll event');
                        switch (item.itemId) {
                            case 'contextMenuAdd':
                                me.addProject(item);
                                break;
                            case 'contextMenuRemove':
                                me.removeProject(item);
                                break;
                            case 'contextMenuEdit':
                                me.editProjectCode(item);
                                break;
                            case 'contextMenuLoadParam':
                                me.loadParam(item);
                                break;
                            case 'contextMenuLoadBlock':
                                me.loadBlock(item);
                                break;
                            //case 'contextMenuCalcParam':
                            //    me.calcParam(item);
                            //    break;
                            case 'contextMenuNonstdParam':
                                me.nonstdParam(item);
                                break;
                            case 'contextMenuValidParam':
                                me.validParam(item);
                                break;
                            case 'contextMenuMarkDraw':
                                me.markDraw(item);
                                break;
                            case 'contextMenuDownDraw':
                                me.downDraw(item);
                                break;
                            case 'contextMenuUploadDraw':
                                me.uploadDraw(item);
                                break;
                            case 'contextMenuReDesign':
                                me.reDesign(item);
                                break;
                            case 'contextMenuHistory':
                                me.history(item);
                                break;
                        }
                    }
                }
            });
        }

        evt.stopEvent();
        var section = rec.data['section'];
        var data = rec.get('Data');
        var validOp = section || data;

        this._contextMenu.items.items.forEach(function(f) {
            if (f.itemId != 'contextMenuAdd' && f.itemId != 'contextMenuReDesign') {
                f.setDisabled(!validOp);
            }
            f.sectionCode = section || data;
        });
        this._contextMenu.showAt(evt.getXY());
    },

    makeTreeContextMenuItems: function() {
        var items = [];
        if (this.contextMenuType === 'default') {
            items = [{
                text: this.contextMenuAddText,
                itemId: 'contextMenuAdd'
            }, {
                text: this.contextMenuRemoveText,
                itemId: 'contextMenuRemove'
            }, '-', {
                text: this.contextMenuEditCodeText,
                itemId: 'contextMenuEdit'
            }, '-', {
                text: this.contextMenuDownDrawText,
                itemId: 'contextMenuDownDraw'
            }, {
                text: this.contextMenuHistoryText,
                itemId: 'contextMenuHistory'
            }];
        } else if (this.contextMenuType === 'design') {
            items = [{
                text: this.contextMenuLoadParamText,
                itemId: 'contextMenuLoadParam'
            }, {
                text: this.contextMenuLoadBlockText,
                itemId: 'contextMenuLoadBlock'
            }, '-',/* {
                text: this.contextMenuCalcParamText,
                itemId: 'contextMenuCalcParam'
            },*/ {
                text: this.contextMenuNonstdParamText,
                itemId: 'contextMenuNonstdParam'
            }, {
                text: this.contextMenuValidParamText,
                itemId: 'contextMenuValidParam'
            }, '-', {
                text: this.contextMenuMarkDrawText,
                itemId: 'contextMenuMarkDraw'
            }, {
                text: this.contextMenuDownDrawText,
                itemId: 'contextMenuDownDraw'
            }, {
                text: this.contextMenuUploadDrawText,
                itemId: 'contextMenuUploadDraw'
            }, '-', {
                text: this.contextMenuReDesignText,
                itemId: 'contextMenuReDesign'
            }, {
                text: this.contextMenuHistoryText,
                itemId: 'contextMenuHistory'
            }];
        }
        return items;
    },

    addProject: function(item) {
        var me = this,
            lastCode = 0;
        this._menuStore.each(function(r) {
            var code = r.get('Data') || r.get('data');
            if (!code) return;
            var reg = new RegExp('^' + me.projectCodePrefix + '(\\d{1,3})$');
            if (reg.test(code)) {
                var ms = reg.exec(code)[1];
                var n = parseInt(ms);
                if (n > lastCode) lastCode = n;
            }
        });

        lastCode++;
        var newCode = me.projectCodePrefix + lastCode;
        me.internalAddProject(item.sectionCode, newCode);
    },

    internalAddProject: function(sectionCode, code) {
        var me = this;
        this.mask('loading...');
        this._formLoaded = false;
        sef.utils.ajax({
            url: this.addUrl,
            method: 'POST',
            jsonData: {
                projectId: me._id,
                Code: code,
                ParentCode: sectionCode,
                Action: 'New'
            },
            success: function(result, resp) {
                var result = resp[me.resultProperty];
                me.loadData(result, true);
                me.selectTreeNode(code);
                me.switchCardView(code);
                me._formLoaded = true;
                //me.updateEditMode();
                me.unmask();
            },
            failure: function(err, resp) {
                me.unmask();
                sef.dialog.error(err.message);
                console.log('failure#', err, cb);
            }
        });
    },

    removeProject: function(item) {
        var me = this,
            code = item.sectionCode;
        sef.dialog.confirm('确认删除[' + code + ']', null, function() {
            me.internalRemoveProject(code);
        });
    },

    internalRemoveProject: function(code) {
        var me = this,
            rec = this._menuStore.findRecord('Data', code);

        if (this._oriData[code]) {
            this.mask('loading...');
            sef.utils.ajax({
                url: me.removeUrl,
                method: 'POST',
                jsonData: {
                    projectId: me._id,
                    Code: code,
                    Action: 'Remove'
                },
                success: function(result, resp) {
                    var result = resp[me.resultProperty];
                    me.loadData(result, true);
                    me.selectTreeNode();
                    me._formLoaded = true;
                    me.updateEditMode();
                    me.unmask();
                },
                failure: function(err, resp) {
                    me.unmask();
                    sef.dialog.error(err.message);
                    console.log('failure#', err, cb);
                }
            });
        }
    },

    editProjectCode: function(item) {
        var me = this;
        var oldCode = item.sectionCode;
        sef.dialog.mprompt(this.contextMenuEditCodePromptText, null, function(v) {
            if (v === oldCode) return;
            me.internalEditCode(oldCode, v);
        }, null, oldCode);
    },

    internalEditCode: function(code, newCode) {
        var me = this;
        this._formLoaded = false;
        this.mask('loading...');
        sef.utils.ajax({
            url: me.changeCodeUrl,
            method: 'POST',
            jsonData: {
                projectId: me._id,
                OldCode: code,
                NewCode: newCode,
                Action: 'EditCode'
            },
            success: function(result, resp) {
                var result = resp[me.resultProperty];
                me.loadData(result, true);
                me.selectTreeNode();
                me._formLoaded = true;
                me.updateEditMode();
                me.unmask();
            },
            failure: function(err, resp) {
                me.unmask();
                sef.dialog.error(err.message);
                console.log('failure#', err, cb);
            }
        });
    },

    loadParam: function(item) {
        var me = this,
            code = item.sectionCode;

        if (Ext.isFunction(this.onLoadParam)) {
            this.onLoadParam.call(this, this, this._id, code);
        }
    },

    loadBlock: function(item) {
        var me = this,
            code = item.sectionCode;

        if (Ext.isFunction(this.onLoadBlock)) {
            this.onLoadBlock.call(this, this, this._id, code);
        }
    },

    calcParam: function(item) {
        var me = this,
            code = item.sectionCode;
        sef.dialog.confirm('确认计算梯号[' + code + ']参数信息?', null, function() {
            if (Ext.isFunction(me.onCalcParam)) {
                me.onCalcParam.call(me, me, me._id, code);
            }
        });
    },

    nonstdParam: function(item) {
        var me = this,
            code = item.sectionCode;
        sef.dialog.confirm('确认计算梯号[' + code + ']非标信息?', null, function() {
            if (Ext.isFunction(me.onNonstdParam)) {
                me.onNonstdParam.call(me, me, me._id, code);
            }
        });
    },

    validParam: function(item) {
        var me = this,
            code = item.sectionCode;
        sef.dialog.confirm('确认计算梯号[' + code + ']校验信息?', null, function() {
            if (Ext.isFunction(me.onValidParam)) {
                me.onValidParam.call(me, me, me._id, code);
            }
        });
    },

    markDraw: function(item) {
        var me = this,
            code = item.sectionCode;
        sef.dialog.confirm('确认生成梯号[' + code + ']图纸?', null, function() {
            if (Ext.isFunction(me.onMarkDraw)) {
                me.onMarkDraw.call(me, me, me._id, code);
            }
        });
    },

    downDraw: function(item) {
        var me = this,
            code = item.sectionCode;
        me.onDownDraw.call(me, me, me._id, code);
    },

    uploadDraw: function (item) {
        var me = this,
            code = item.sectionCode;
        me.onUploadDraw.call(me, me, me._id, code);
    },

    reDesign: function(item) {
        var me = this,
            code = item.sectionCode;
        var msg = '确认梯号[' + code + ']重新设计?';
        if (!code) {
            msg = '确认选择梯号重新设计?';
        }
        sef.dialog.confirm(msg, null, function() {
            if (Ext.isFunction(me.onReDesign)) {
                me.onReDesign.call(me, me, me._id, code);
            }
        });
    },

    history: function (item) {
        var me = this,
            code = item.sectionCode;

        if (Ext.isFunction(me.onHistory)) {
            me.onHistory.call(me, me, me._id, code);
        }
    },


    makeTree: function() {
        var me = this;
        var tree = {
            xtype: 'sef-pagetree',
            itemId: 'menuTree',
            title: false,
            collapsible: false,
            iconCls: null,
            width: 150,
            //url: '/apps/liftnext/mock/project-cat.json',
            cls: 'sef-pagetree-timeline',

            listeners: {
                'rowcontextmenu': function(tree, record, tr, rowIndex, e, eOpts) {
                    //console.log('will show context menu now>>>',tree,tr,record,tr,rowIndex,e);
                    if (me.enableContextMenu === true) {
                        me.showTreeContextMenu(record, e);
                    }
                },
                'beforeitemexpand': function(node) {
                    return me.processTreeNodeExpand(node);
                    //console.log('node will expand',node);
                },
                'itemclick': function(tree, record) {
                    me.processTreeItemClick(record);
                }
            }
        };
        if (this.navTreeStoreIsLocal === true) {
            Ext.apply(tree, {
                store: Ext.create('Ext.data.TreeStore', {
                    model: 'sef.core.model.TreeModel',
                    proxy: {
                        type: 'memory'
                    }
                })
            });
        } else {
            tree['url'] = this.navTreeUrl;
        }
        return tree;
    },

    processTreeNodeExpand: function(treeNode) {
        //console.log(treeNode);
        //return false;
    },

    processTreeItemClick: function(rec) {
        var code = rec.data['section'];
        //console.log('will process scroll event');
        //var form=this.down('#card_L1');
        //form.scrollToElement('subtitle_L1_3',true);

        var sectionIndex = rec.data['sectionIndex'];
        if (code) {
            this.switchViewSection(code, sectionIndex);
        } else {
            code = rec.get('Data');
            if (code) {
                this.switchCardView(code);
            }
        }
        if (code) {
            if (Ext.isFunction(this.onTreeNodeClick)) {
                this.onTreeNodeClick.call(this, this, rec, code);
            }
            this.updateTip(code, rec.data);
            this.selectCode = code;
            this.selectNode = rec.get('Node');
        }
    },

    trackContainerScroll: function(x, y) {
        //console.log(x, y);
    },

    switchViewSection: function(section, index) {
        //console.log('will switch to new section#',section,index);
        var form = this.down('#card_' + section);
        var sub = 'subtitle_' + section + '_' + index;
        if (sub) {
            form.scrollToElement(sub, true);
        }
        this.switchCardView(section);

    },

    switchCardView: function(code) {
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

    makeFormContent: function() {

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
            layoutId: 0,
            defaults: {
                columnWidth: 0.25
            },
            collapsible: true,
            collapsed: this.commonFormCollapsed,
            ui: 'sefu-formpanel-coll',
            title: '<div class="text">' + this.navTreeCommonNodeText + '</div>',
        };
    },

    updateMenuData: function(menus) {
        if (!menus) return;

        //var menuStore=this.down('#menuTree').getStore();
        if (!Ext.isArray(menus)) menus = [menus];

        menus = Ext.Array.insert(menus, 0, [{
            Text: this.navTreeCommonNodeText,
            Leaf: true
        }]);
        var rootCfg = {
            //Text:'',
            expanded: true,
            children: menus //sef.runningCfg.getUser().Menus
        };
        //console.log(rootCfg);
        this._menuStore.setRoot(rootCfg);
    },

    selectTreeNode: function(code) {
        var rec = null;

        //debugger;
        if (!code) {
            //will select first node
            rec = this._menuStore.getAt(1);
            //console.log(rec);
            if (rec) code = rec.get('Data');
            //this.updateTip('L1');

        } else {
            rec = this._menuStore.findRecord('Data', code);
        }
        if (rec) {
            this.updateTip(code, rec.data);
            this.selectCode = code;
            this.selectNode = rec.get('Node');
            this.down('#menuTree').setSelection(rec);

            if (Ext.isFunction(this.onTreeNodeClick)) {
                this.onTreeNodeClick.call(this, this, rec, code);
            }
        }
    },

    loadData: function(result, reload) {
        var me = this;
        me.mask('loading...');
        this.suspendLayout = true;
        this._formLoaded = false;
        this._id = result.ProjectID;
        //debugger
        //重置树
        if (reload === true) {
            this._menuStore.getRoot().removeAll(false);
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
        //console.log('tree.items#',items);
        //设置梯号树
        Ext.each(items, function(item) {
            var text = item.Text || item.Code;
            var t = {
                Text: text,
                Data: item.Code,
                DataID: item.ID,
                CustomNode: item.CustomNode,
                Leaf: item.Leaf,
                Node: item
            };
            menus.push(t);
        });
        this.updateMenuData(menus);

        ////设置合同信息
        var common_node = result.CommonNode;

        var common_layout = Ext.isString(common_node.Layout) ? Ext.JSON.decode(common_node.Layout) : common_node.Layout;
        if (common_layout && common_node.Params) {
            me.makeCommonItems(common_layout.Layout, common_node.Params);
        }
        //设置梯号下级节点
        me.makeParamLayout(result, items);

        me.selectTreeNode();
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
        Ext.each(items, function(item) {
            var layout = Ext.isString(item.Layout) ? Ext.JSON.decode(item.Layout) : item.Layout;
            me.updateSectionLayout(item, layout.Layout);
            me.updateFormData(item, item.Params);
            me.bindFormBlurEvent(item);
        });
    },

    bindFormBlurEvent: function(item) {
        if (this.watchFieldChange === false) return;

        var me = this;
        var code = item.Code;
        var cardId = 'card_' + code;
        var form = this._formCard.down('#' + cardId);
        if (form) {
            form.items.items.forEach(function (f) {
                if (f.changeData && Ext.isFunction(f.setTrackValueChange)) {
                    f.setTrackValueChange(true);
                    f.on('valuechangecomplete', function (field) {
                        if (Ext.isFunction(me.onFormFieldBlur)) {
                            me.onFormFieldBlur.call(field, field, form, code);
                        }
                    });
                }
            });
        }
    },


    toggleGroupFieldDisplayMode: function(btn, lcode, gindex) {
        //lcode:ln no
        //gcode:group code
        var key = ['l', lcode, 'group', gindex, 'showing'].join('_');
        var vm = this.getViewModel(); //.getData();
        var lastVD = vm.getData()[key];
        //console.log(vm.getData());
        lastVD = !lastVD;
        btn.setText(lastVD === false ? '显示更多参数' : '隐藏更多参数');
        var d = {};
        d[key] = lastVD;
        vm.setData(d);
        //console.log(vm.getData());
        //vm.setData()
        //console.log('will toggle group field display mode', lcode, gcode);
    },

    updateSectionLayout: function(item, lc, autoExpand) {
        //console.log('id#', item, lc);
        var _vmode = {};
        if (!lc) return;
        var me = this;
        var items = [];
        var groups = [];
        var code = item.Code;
        lc.forEach(function(l, index) {
            //_vmode['']
            var gkey = ['l', code, 'group', index, 'showing'].join('_');
            _vmode[gkey] = me.groupFieldShowMode === 'hide' ? false : true;

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

            //set binder to each item
            //var fmtItems=[];
            var exFieldCount = 0;
            var fmtItems = Ext.Array.map(l.Items, function(litem) {
                //只有字段标识为exshowing才会加入到显示/隐藏序列
                if (litem.exshowing !== true) {
                    return litem;
                }

                var binder={};
                binder['hidden']='{!'+gkey+'}';
                //console.log(binder);
                var newItem = Ext.merge({}, litem);
                Ext.merge(newItem,{
                    bind:binder
                });
                exFieldCount++;
                return newItem;
            });

            items = Ext.Array.merge(items,fmtItems);// l.Items);
            //push expand
            if (exFieldCount > 0) {
                var expandField = {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        pack: 'end'
                    },
                    columnWidth: 1,
                    items: {
                        xtype: 'button',
                        btnType: 'link',
                        text: me.groupFieldShowMode === 'hide' ? '显示更多参数' : '隐藏更多参数',
                        handler: function(btn) {
                            me.toggleGroupFieldDisplayMode(btn, code, index);
                        }
                    }
                };
                items.push(expandField);
            }


        });



        //console.log(_vmode);

        //增加树的节点
        var rec = this._menuStore.findRecord('Data', code);
        if (rec) {
            rec.appendChild(groups, true, true);
            if (autoExpand !== false) {
                rec.expand();
            }

        }


        //console.log('menu.rec###',rec);

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
                layoutId: item.LayoutID,
                recId: item.ID,
                itemId: cardId
            });
            //debugger;
            this._formCard.add(f);

        }

        this.getViewModel().setData(_vmode);

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
                LayoutID: f.layoutId,
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
            items: [this.makeTree(), this.makeContent()]
        });
        this.callParent(arguments);
        var me = this;
        this.on('afterlayout', function() {
            me.mask('loading...');
            //console.log('for layout doing...');
        }, null, {
            single: true
        });

        if (!this._menuStore) {
            this._menuStore = this.down('#menuTree').getStore();
        }
        this._formCard = this.down('#formCard');

        if (false && window.SEF_LIB_CFG.env === 'te') {
            var me = this;
            var reTs = 0;
            this.on('beforerender', function() {
                me.reTs = +new Date();
                console.log('complexprojectform.beforerender', me.reTs);
            });
            this.on('afterrender', function() {
                var t = +new Date();
                //me.mask('loading...');
                console.log('complexprojectform.afterrender', t, (t - me.reTs) + 'ms');
            });
        }
        //this.loadForm();

    },

    onDestroy: function() {
        this.callParent(arguments);
        if (this._contextMenu) {
            this._contextMenu.destroy();
        }
    }
});