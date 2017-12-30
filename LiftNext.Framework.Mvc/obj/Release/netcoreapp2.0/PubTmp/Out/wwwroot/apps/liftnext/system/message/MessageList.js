//UserList
Ext.define('sef.app.liftnext.system.message.MessageList', {
    extend: 'sef.core.components.page.ListPage',
    xtype: 'sef-messagelist',
    colConfig: [ {
        name: 'Title',
        width: 120
    }, {
            name: 'Content',
        width: 250
    }, {
            name: 'Type',
        width: 100
    }, {
            name: 'IsReaded',
        width: 120
    }, {
            name: 'IsNeedHandle',
        width: 120
    }, {
            name: 'SendDate',
            width :120
    }, {
            name: 'ExpiryTime',
        width: 120
    }],
    //columns:['code'],
    searchConfig: {
        quickSearch: ['Title']
    },

    bars: [
    {
        text: '发送系统更新消息',
        xtype: 'sef-actionbutton',
        dataAction: false,
        actionName: 'sendupdatemsg'
    }],

    sendupdatemsg__execute: function (btn) {
        var grid = this.up('sef-messagelist');
        var dialog = Ext.create('sef.core.components.window.BaseDialog', {
            title : '编辑系统更新消息内容',
            width: '40%',
            height: '35%',
            xtype: 'sef-formpanel',
            layout: 'column',
            scrollable: 'y',
            bodyPadding: '0 10px 20px 10px',
            cls: 'sef-formpanel',
            defaults: { columnWidth: 0.5, margin: '10px 10px 5px 10px', xtype: 'textfield', labelAlign: 'left', labelSeparator: '' },
            items: [{
                xtype: 'textfield',
                fieldLabel: '消息标题',
                name: 'Title',
                itemId: 'Title',
                columnWidth: 0.5,
                allowBlank: false,
                value : '系统更新消息'
            }, {
                xtype: 'numberfield',
                fieldLabel: '持续时间(分钟)',
                name: 'Minute',
                itemId: 'Minute',
                allowBlank: false,
                value: '5'
            }, {
                xtype: 'textarea',
                fieldLabel: '消息内容',
                name: 'Content',
                itemId: 'Content',
                columnWidth: 1,
                allowBlank: false,
                value : '系统将于5分钟后进行程序更新，请及时保存数据，更新将持续10分钟左右！'
            }]
        });
        dialog.on('dialogclose', function (state, result) {
            if (state === 0) {
                var title = dialog.down('#Title').getValue();
                var content = dialog.down('#Content').getValue();
                var minute = dialog.down('#Minute').getValue();
                sef.utils.ajax({
                    url: 'Message/SendUpdateMessage',
                    method: 'POST',
                    paramAsJson: true,
                    jsonData: {
                        title: title,
                        content: content,
                        minute: minute
                    },
                    scope: dialog,
                    success: function (result) {
                        sef.message.success("系统更新消息发送成功.", 3000);
                        dialog.close();
                        grid.reload();
                    },
                    failure: function (err, resp) {
                        sef.dialog.error(err.message);
                        me.setLoading(false);
                        console.log('error', err);
                    }
                });
            }
        }, this);
        dialog.show();
    },

    onPageReady: function () {
        this.updatePermission({
            sendupdatemsg: true
        });
    },
});