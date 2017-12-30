Ext.define('sef.core.components.window.CustomFormLayoutDialogCtrl', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.cfl-ctrl',

    _psStoreLoaded: false,

    afterRender: function (view) {

        this.makeLayoutViewDD();

    },


    makeFieldPlaceHolder: function (cfg) {
        var place = {};//Ext.merge({},cfg);
        Ext.apply(place, {
            clsType: 'fa-square-o',
            Text: 'Empty',
            Code: 'Empty',
            Group: cfg.Group,
            GroupText: cfg.GroupText,
            Index: cfg.Index,
            CW: 3,
            Hold: true,
            _gidx: cfg._gidx,
            _iidx: cfg._iidx,
            Type: 0
        });
        return place;
    },

    reorderStore: function (store) {
        var _lastIdx = 0;
        var _lastG = 0;
        store.each(function (rec, idx) {
            //console.log(rec);

            var grp = rec.data.Group;
            var gidx = rec.data._gidx;

            //var iidx=rec.data._iidx;

            if (gidx !== _lastG) {
                _lastG = gidx;
                _lastIdx = 0;
            }

            var rIdx = _lastIdx++;
            var rIndex = gidx + rIdx;

            //rec.data.iidx=_lastIdx++;
            rec.data._iidx = rIdx;
            rec.set('Index', rIndex);
            rec.set('Type', rIndex - _lastG);

            //console.log(rec.data.Text,grp,gidx,iidx,index);
        });
    },

    makeLayoutViewDD: function () {
        var me = this,
            dataview = this.lookupReference('layoutview'),
            psview = this.lookupReference('allpsview');

        this.layoutDragZone = new Ext.view.DragZone({
            view: dataview,
            ddGroup: 'layoutgroup'
        });

        //debugger;
        this.psDragZone = new Ext.view.DragZone({
            view: psview,
            ddGroup: 'layoutgroup'
        });

        this.layoutDropZone = new sef.core.view.VerticalDropZone({
            view: dataview,
            //ddGroup:['layoutgroup','psgroup'],
            ddGroup: 'layoutgroup',//,'psgroup'],
            handleNodeDrop: function (data, record, position) {
                //console.log('will handle node drop');
                var view = this.view, store = view.getStore(), index, records, i, len;
                //debugger;
                var sourceRec = data.records[0];
                if (sourceRec.data.Hold === true) return;

                index = store.indexOf(record);
                var tindex = record.data._iidx;
                //debugger;
                if (position !== 'before') {
                    index++;
                    tindex++;
                }
                //console.log(data);
                var recData = Ext.merge({}, sourceRec.data);
                var fromGroup = recData.Group;
                recData._gidx = record.data._gidx;
                recData._iidx = tindex;
                recData.Index = recData._gidx + tindex;
                recData.Group = record.data.Group;
                recData.GroupText = record.data.GroupText;
                recData.Type = record.data.Type;
                var cw = recData.CW || 3;
                recData.CW = cw;
                recData.CWP = (1 / cw) * 100;
                if (sourceRec.store !== store) {
                    //remove 
                    data.records[0].store.remove(sourceRec);
                }
                //view.suspendLayout=true;
                //检查指定的组是否已无数据
                var place = null, pIndex = -1, grpRecords = store.queryBy(function (rec) {
                    return rec.get('Group') === fromGroup;
                });
                //console.log(fromGroup,grpRecords.length);
                if (grpRecords.length === 1) {
                    //debugger;
                    place = me.makeFieldPlaceHolder(grpRecords.items[0].data);
                } else if (grpRecords.length >= 2) {
                    //remove place holder
                    grpRecords = store.queryBy(function (rec) {
                        return rec.get('Group') === fromGroup && rec.get('Hold') === true;
                    });
                    grpRecords.length && store.remove(grpRecords.getAt(0));
                }


                //console.log(fromGroup,grpRecords);
                //to group check



                store.insert(index, recData);
                if (place) {
                    store.insert(9999, place);
                }
                //debugger;
                grpRecords = store.queryBy(function (rec) {
                    return rec.get('Group') === recData.Group;// && rec.get('Hold')===true;
                });
                if (grpRecords.length >= 2) {

                    grpRecords = store.queryBy(function (rec) {
                        return rec.get('Group') === recData.Group && rec.get('Hold') === true;
                    });
                    //debugger;
                    grpRecords.length && store.remove(grpRecords.getAt(0));
                }

                me.reorderStore(store);


                store.sort([{
                    property: 'Index',
                    direction: 'ASC'
                }]);
                //re sort data
                //store.each()
                //view.suspendLayout=false;
                //view.updateLayout();
                //console.log(store);
                //view.getSelectionModel().select(data.records);
                //console.log(store.getData());
            }
        });

        //console.log(this.layoutDragZone,this.layoutDropZone);

    },


    makeLayoutStore: function (data) {
        var sdata = [];
        Ext.Array.each(data, function (d, idx) {
            var index = idx * 100;

            Ext.Array.each(d.Items, function (di, iidx) {
                var item = Ext.merge({}, di);
                var cw = iidx.CW || 3;
                Ext.apply(item, {
                    Type: iidx,
                    Group: d.Code,
                    GroupText: d.Text,
                    Index: index + iidx + 1,
                    CWP: (1 / cw) * 100,
                    _gidx: index,
                    _iidx: iidx + 1
                });
                sdata.push(item);
            });
        });

        //console.log(sdata);//,store.getData());
        //return;
        var store = this.lookupReference('layoutview').getStore();
        store.loadData(sdata, false);
    },

    onViewItemKeyDown: function (v, record, item, index, e) {
        var key = e.getKey();
        if (key === Ext.event.Event.DELETE
            || key === 8) {
            //console.log('will keydown',v,record,item,index,e);
            //console.log('will delete this node');
            var store = v.getStore();
            var recData = Ext.merge({}, record.data);
            var fromGroup = recData.Group;
            //debugger;

            var place = null, pIndex = -1, grpRecords = store.queryBy(function (rec) {
                return rec.get('Group') === fromGroup;
            });
            //console.log(fromGroup,grpRecords.length);
            if (grpRecords.length === 1) {
                //debugger;
                place = this.makeFieldPlaceHolder(grpRecords.items[0].data);
            }

            var index = store.indexOf(record);

            if (place) {
                store.insert(index, place);
                //console.log(place,store);
            }
            store.remove(record);
            //this.reorderStore(store);
            //append to ps store
            var psview = this.lookupReference('allpsview');
            var psstore = psview.getStore();
            psstore.add([recData]);
        }
    },

    getLayoutItems: function (companyId, layoutId, callBack) {
        sef.utils.ajax({
            url: '/MyLayout/GetMyLayoutItems',
            method: 'POST',
            paramAsJson: true,
            jsonData: {
                layoutId: layoutId,
                companyId: companyId
            },
            success: function (result) {
                callBack(result);
            },
            failure: function (err, resp) {
                sef.dialog.error(err.message);
                console.log('error', err);
            }
        });
    },

    onLayoutTemplateChange: function (cb, newValue) {
        var layoutId = cb.getSelection().get('ID');
        var text = cb.getSelection().get('Text');
        this.lookupReference('layoutName').setValue(text);
        var me = this;
        this.getLayoutItems(me.view.companyId, layoutId, function (data) {
            if (data.ID !== 0) {
                me.lookupReference('layoutScope').setValue(data.Owner);
                me.lookupReference('layoutModule').setValue(data.UseType);
            }
            data.Groups.forEach(function (f) {
                f.Items.forEach(function (v) {
                    Ext.apply(v, {
                        clsType: (v.Xtype == 'sef-paramcombo' ? 'fa-bars' : (v.Xtype == 'textfield' ? 'fa-file-text-o' : 'fa-sort-numeric-asc'))
                    });
                });
            });
            me.makeLayoutStore(data.Groups);
            data.Params.forEach(function (v) {
                Ext.apply(v, {
                    clsType: (v.Xtype == 'sef-paramcombo' ? 'fa-bars' : (v.Xtype == 'textfield' ? 'fa-file-text-o' : 'fa-sort-numeric-asc'))
                });
            });
            me.lookupReference('allpsview').getStore().loadData(data.Params);
        });
    },

    onSaveLayout: function () {
        var cbTemp = this.lookupReference('layoutTemplate');
        var rec = cbTemp.getSelection();
        if (!rec) {
            sef.message.warning("请选择一个布局.");
            return;
        }
        var layoutId = rec.get('ID');
        var layoutName = this.lookupReference('layoutName').getValue();

        var owner = this.lookupReference('layoutScope').getValue();
        var useType = this.lookupReference('layoutModule').getValue();

        var result = [];
        var layoutStore = this.lookupReference('layoutview').getStore();
        layoutStore.each(function (rec) {
            //console.log(rec);
            var data = {
                Index: rec.get('Index'),
                Code: rec.get('Code'),
                Text: rec.get('Text'),
                Xtype: rec.get('Xtype'),
                GroupCode: rec.get('Group'),
                GroupName: rec.get('GroupText')
            };
            result.push(data);
        });
        var me = this;
        var companyId = me.view.companyId;
        sef.dialog.confirm(_('确认要保存当前布局?'), '', function () {
            sef.utils.ajax({
                url: '/MyLayout/SaveMyLayout',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    layoutId: layoutId,
                    layoutName: layoutName,
                    useType: useType,
                    owner: owner,
                    companyId: companyId,
                    layoutItems: result
                },
                success: function (result) {
                    sef.message.success("保存布局成功", 3000);
                },
                failure: function (err, resp) {
                    sef.dialog.error(err.message);
                    console.log('error', err);
                }
            });
        });
    },

    onDefaultLayout: function () {
        var cbTemp = this.lookupReference('layoutTemplate');
        var rec = cbTemp.getSelection();
        if (!rec) {
            sef.message.warning("请选择一个布局.");
            return;
        }
        var layoutId = rec.get('ID');

        var me = this;
        sef.dialog.confirm(_('确认要设置为默认布局?'), '', function () {
            sef.utils.ajax({
                url: '/MyLayout/SetDefaultLayout',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    layoutId: layoutId
                },
                success: function (result) {
                    sef.message.success("设置默认布局成功", 3000);
                },
                failure: function (err, resp) {
                    sef.dialog.error(err.message);
                    console.log('error', err);
                }
            });
        });
    },

    onApplyLayout: function () {
        var cbTemp = this.lookupReference('layoutTemplate');
        var rec = cbTemp.getSelection();
        if (!rec) {
            sef.message.warning("请选择一个布局.");
            return;
        }
        var layoutId = rec.get('ID');
        this.view._dialogResult = layoutId;
        this.view.closeDialog(0, 0);
    },

    onAddGroup: function () {
        var cbTemp = this.lookupReference('layoutTemplate');
        var rec = cbTemp.getSelection();
        if (!rec) {
            sef.message.warning("请选择一个布局.");
            return;
        }

        var layoutview = this.lookupReference('layoutview');
        var store = layoutview.getStore();
        var me = this;
        var maxGroupIndex = 0;
        var storeCount = store.getCount();
        var lastData = store.getAt(storeCount - 1);
        var lastGroup = '';
        if (lastData) {
            lastGroup = lastData.get('Group');
            maxGroupIndex = parseInt(lastGroup.split('_')[1]) + 1;
        }

        sef.dialog.mprompt("请输入分组名称", null, function (v) {
            place = me.makeFieldPlaceHolder({
                Group: 'G_' + maxGroupIndex,
                GroupText : v,
                Index: maxGroupIndex * 100,
                _gidx: maxGroupIndex * 100,
                _iidx: 0,
            });
            store.insert(storeCount, place);
            store.sort([{
                property: 'Index',
                direction: 'ASC'
            }]);
            //console.log(store)
        }, null);
        
    },

    onDeleteGroup: function () {
        var cbTemp = this.lookupReference('layoutTemplate');
        var rec = cbTemp.getSelection();
        if (!rec) {
            sef.message.warning("请选择一个布局.");
            return;
        }
        var layoutview = this.lookupReference('layoutview');
        var store = layoutview.getStore();
        var storeCount = store.getCount();

        sef.dialog.mprompt("请输入要删除的分组名称", null, function (v) {
            store.filter([{
                property: 'GroupText',
                value: v
            }]);
            var lastCount = store.getCount();
            if (lastCount == 0) {
                sef.message.error("准备删除的分组[" + v + "]不存在.");
                store.clearFilter();
                return;
            }
            if (storeCount == lastCount) {
                sef.message.error("无法删除最后一个分组.");
                store.clearFilter();
                return;
            }
            store.removeAll();
            store.clearFilter();
            store.sort([{
                property: 'Index',
                direction: 'ASC'
            }]);
            //console.log(store)
        }, null);
    },

    destroyDragRef:function(){
        this.layoutDragZone=Ext.destroy(this.layoutDragZone);
        this.psDragZone=Ext.destroy(this.psDragZone);
        
    },

    
    

    destroy:function(){
        this.destroyDragRef();
        this.callParent();
    }

});