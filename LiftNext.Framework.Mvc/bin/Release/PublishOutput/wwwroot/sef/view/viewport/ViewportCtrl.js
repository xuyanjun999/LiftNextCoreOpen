//MdiViewportCtrl.js

Ext.define('sef.core.view.viewport.ViewportCtrl', {
    extend: 'Ext.app.ViewController',

    //alias: 'controller.sefc-mdivp',

    privates: {
        _task: null,
        _internalInited: false,
        _loadingToast: null,
        _appContainer: null,
        _existApp: null,
        _lastClickTabRouteId: '',
        _msgDelayCount: 0,
        _sysUpdateExpireTickets: 0
    },

    listen: {
        controller: {
            '#': {
                unmatchedroute: 'onRouteChange'
                    //afterrender:'onAfterRender'
            }
        }
    },

    control: {
        '#': {
            afterrender: 'onViewportReady',
            beforeDestroy: 'onViewportBeforeDestroy'
        }
    },



    closeActiveDialog: function() {
        var curDialog = Ext.WindowManager.getActive();
        //console.log('check active dialog#',curDialog);
        if (curDialog && curDialog.isWindow) {
            curDialog.destroy();
        }
    },

    showLoginDialog: function() {
        //检测当有登录窗口在显示时则不用再显示
        if (sef.runningCfg.loginDialogIsShowing === true) return;

        this.closeActiveDialog();
        var me = this,
            dialog = Ext.create('sef.core.view.security.LoginWindow', { //SEF.core.view.security.LoginDialog', {
                //title:'Login',
                width: 300,
                height: 300
            });
        dialog.on('loginsuccess', function() {
            sef.runningCfg.loginDialogIsShowing = false;
            dialog.close();
            me._internalInited = false;
            //first remove all items
            if (me.onLoginSuccess() !== false) {
                me.redirectTo(sef.utils.makeTokenHash('', true));
            }

            //console.log('login donw now');
        });
        sef.runningCfg.loginDialogIsShowing = true;
        dialog.show();
    },

    onLoginSuccess: function() {
        //debugger;
        var ac = this.getReferences().mainAppContainer;
        if (ac) {

            ac.removeAll(true);

        }
    },



    onRouteChange: function(token) {

        if (sef.runningCfg.getUser().ID < 1) {
            this.showLoginDialog();
            return;
        }
        this.internalInit();



        var tObj = sef.utils.decodeHash(token);
        if (Ext.isEmpty(tObj.appCls)) {
            return;
        }

        this._loadingToast = sef.message.loading('loading app...', 10000000);
        //return;
        this.switchApp(tObj);


    },

    showDashboard: function() {

    },

    switchApp: function(tokenObj) {
        //this._existApp = this._appContainer.child('component[routeId=' + tokenObj.appId + ']');
        this._existApp = this._appContainer.down('#' + tokenObj.appId);
        //console.log(this._existApp,tokenObj.appId);
        if (!this._existApp) {
            var me = this;
            Ext.require(tokenObj.appCls, function(loaderCls) {
                //console.log('here is loaded',cls);
                var newView = Ext.create(loaderCls, {
                    routeId: tokenObj.appId,
                    itemId: tokenObj.appId,
                    routeToken: tokenObj,
                    cls: 'sef-apppage-panel',
                    tabConfig: {
                        tRouteId: tokenObj.appId,
                        listeners: {
                            scope: me,
                            'click': me.onTabClickHandler,
                            'beforeclose': me.onTabBeforeClose
                        }
                    }
                });
                //window.___sef_history_count_++;
                this.showApp(newView, tokenObj, true)
            }, me);
        } else {
            this.showApp(this._existApp, tokenObj, false);
        }
        //console.log(this._appContainer,this._existApp);
    },

    showApp: function(app, tokenObj, isNew) {
        var me = this;
        this.closeActiveDialog();
        //console.log('will show app#', isNew);
        if (!app.isWindow) {
            if (isNew) {
                Ext.suspendLayouts();
                this._existApp = this._appContainer.add(app);

                //console.log(this._existApp, this._appContainer.getActiveTab());

                //mainLayout.setActiveItem(mainCard.add(appView));
                Ext.resumeLayouts(true);


            }
            tokenObj && this._existApp.updateRoute(tokenObj);
            //debugger;
            this._appContainer.setActiveTab(this._existApp);

            if (this._appContainer.items.length === 1) {
                var tab = this._appContainer.getActiveTab();
                var firstEl = tab.getEl();
                if (firstEl.hasCls('x-hidden-offsets') === true) {
                    firstEl.removeCls('x-hidden-offsets');
                }
                //debugger;
                //var s=firstEl.getStyle('x-hidden-offsets');
                //console.log(tab,firstEl,firstEl.hasCls('x-hidden-offsets'));
                // console.log(firstEl,firstEl.getStyle(),firstEl.isStyle('x-hidden-offsets'));
            }
            //console.log('running...here');

        }

        //console.log(this._appContainer);

        this._loadingToast.close();
        this._loadingToast.destroy();
        this._loadingToast = null;
    },

    onMenuSelectionChange: function (view, node) {
        if (node.isLeaf()) {
            // some functionality to open the leaf(document) in a tabpanel

            if (node.get('Right') === false) {
                sef.message.warning("当前账号无此功能权限!");
                return;
            };
            this.willOpenNewApp(node.get('path') || node.get('url'));
        } else if (node.isExpanded()) {
            node.collapse();
        } else {
            node.expand();
        }
    },

    willOpenNewApp: function(path) {
        if (this._loadingToast) {
            sef.message.error(_('当前正在加载，请稍候', 1000));
            return;
        }
        var to = path; // && (node.get('path') || node.get('url'));
        if (true) { //to) {
            this.redirectTo(sef.utils.makeTokenHash(to));
        }
    },




    init: function() {
        //console.log('ctrl.init');
        //this.showLoginDialog();
    },

    updateMenuTree: function() {
        var mainMenuTree = this.lookupReference('mainMenuTree');
        if (!mainMenuTree) return;
        var rootCfg = {
            //Text:'',
            expanded: true,
            children: sef.runningCfg.getUser().Menus
        };
        //console.log(rootCfg);
        mainMenuTree.getStore().setRoot(rootCfg);
    },

    internalInit: function() {
        if (this._internalInited) return;
        this._internalInited = true;

        this.updateMenuTree();

        this._appContainer = this.getReferences().mainAppContainer;
        //console.log('#cur.user#',sef.runningCfg.getUser());
        this.getViewModel()
            .setData({
                message_count: 0,
                user_name: sef.runningCfg.getUser().Name,
                soft_name: sef.runningCfg.get('Name') ,
                soft_title: sef.runningCfg.get('Title'),
                soft_version: 'v' + sef.runningCfg.get('Version'),
                lang: sef.runningCfg.getLang() === 'cn' ? 'En' : 'Cn'
            });

        var me = this;
        if (this._task) {
            this._task.restart();
        } else {
            this._task = Ext.TaskManager.newTask({
                run: function() {
                    me.checkNewMessage();
                },
                addCountToArgs: true,
                interval: sef.runningCfg.get('MessageInterval', 1) * 1000
            });
            this._task.start();
        }


    },


    checkSystmUpdate: function(item) {
        var isShowing = false;
        if (item === null) {
            isShowing = (+new Date() <= this._sysUpdateExpireTickets);
            this.getViewModel().setData({
                sys_will_update: isShowing
            });
        } else {
            if (this._sysUpdateExpireTickets < 1) this._sysUpdateExpireTickets = +Ext.Date.parse(item.ExpiryTime, 'c');
            isShowing = (+new Date() <= this._sysUpdateExpireTickets);
            this.getViewModel().setData({
                sys_will_update: isShowing,
                sys_update_tip: item.Content
            });
            if (isShowing == false) this._sysUpdateExpireTickets = 0;
        }
    },
    showMessageInfo: function(messages) {
        //sef.message.success(_('你有新的消息'));
        if (!Ext.isArray(messages)) {
            messages = [messages];
        }
        var me = this;



        messages.forEach(function(m) {
            //debugger;

            if (m.Type === 1) {
                //2017-09-20T00:00:00
                //var et=Ext.Date.format(m.ExpiryTime,'c');
                me.checkSystmUpdate(m);

                return;
            }
            if (m.IsNeedHandle === true) {
                sef.notification.success(_('提醒'), m.Content, null, function(args) {
                    //console.log('will close this notifi',this,me,args);
                    sef.utils.ajax({
                        url: sef.runningCfg.get('MessageHandleApi', '/api/messagehandle'),
                        //url: sef.runningCfg.get('MessageApi', '/api/message'),
                        method: 'POST',
                        jsonData: {
                            ID: args.ID
                        }
                    });
                }, { ID: m.ID });
            } else {
                sef.message.success(m.Content, sef.runningCfg.get('MessageDuration', 4000));
            }

        });
        //console.log('will showing message#',messages);
    },

    checkNewMessage: function() {
        if (this._msgDelayCount++ < 1) return;

        //console.log('will check new message', this);
        var me = this,
            url = sef.runningCfg.get('MessageApi', '/api/message');
        sef.utils.ajax({
            url: url + '?ClientTs=' + (+new Date()),
            method: 'GET',
            scope: me,
            success: function(result) {
                //console.log('message.result#',result);
                var count = result.Count;
                //messageApiRootProperty
                if (count > 0) {
                    this.getViewModel()
                        .setData({
                            message_count: count
                        });


                }
                var messages = result[window.SEF_LIB_CFG.messageApiRootProperty || 'Messages'];
                if (messages && messages.length > 0) {
                    me.showMessageInfo(messages);
                } else {
                    me.checkSystmUpdate(null);
                }
            },
            failure: function(err, resp) {

            }
        });
    },
    //iii:0,

    onBeforeTabChangeHandler: function(tabPanel, newTab, oldTab, opts) {
        //console.log(newTab,oldTab);
        //console.log('before change#', newTab.id);
        //debugger;
        if (oldTab && oldTab.tab.waitForClose === true) {
            //based on close
            //if(this.iii++>0)return false;
            //console.log('before change1#', newTab.id, oldTab.id, oldTab.destroyed,this);

            this.redirectTo(newTab.routeToken.str);
            return false;
        }
        if (!Ext.isEmpty(this._lastClickTabRouteId)) {
            if (newTab.routeId === this._lastClickTabRouteId) {
                this._lastClickTabRouteId = '';
                //console.log('before change2#', newTab.id);

                this.redirectTo(newTab.routeToken.str);
                return false;
            }
        }
        //console.log('before change3#', newTab.id);
        //console.log('onBeforeTabChangeHandler#',opts);
    },

    onTabBeforeClose: function(tab) {
        //console.log('will close tab#',tab.tRouteId);
        if (this._lastClickTabRouteId === tab.tRouteId) {
            this._lastClickTabRouteId = '';

        }
        tab.waitForClose = true;
    },

    onTabClickHandler: function(tab, e, opts) {
        this._lastClickTabRouteId = tab.tRouteId;
    },

    onSignOut: function() {
        var me = this;
        sef.dialog.confirm(_('确认退出系统?'), '', function() {
            //me.internalDelete();
            sef.runningCfg.clearUser();
            //debugger;
            //me.destroyMsgTask();
            me._task && me._task.stop();
            me.redirectTo(sef.utils.makeTokenHash('', true));
        });
    },

    onShowUpdateLog: function() {
        var url = sef.runningCfg.get('UpdateLogUrl', '/api/updatelog/');
        var dialog = Ext.create('sef.core.components.window.UpdateLogDialog', { //SEF.core.view.security.LoginDialog', {
            url: url
        });

        dialog.show();
    },

    onChangePwd: function() {
        var url = sef.runningCfg.get('ChangePwdApi', '/api/changepwd/');
        var dialog = Ext.create('sef.core.components.window.ChangePwdDialog', { //SEF.core.view.security.LoginDialog', {
            url: url
        });

        dialog.show();
    },

    onChangeLang: function() {
        sef.runningCfg.changeLang();

        this.gotoHome(true);
    },

    onChangeUIMode: function() {
        sef.runningCfg.changeUIMode();
        this.gotoHome(true);
    },

    onQQSupport: function() {
        //window.open('http://b.qq.com/webc.htm?new=0&sid=73472097&o=liftnext.com&q=7', '_blank', 'height=502, width=644,toolbar=no,scrollbars=no,menubar=no,status=no');
    },

    gotoHome: function(reload) {
        if (reload === true) {
            window.location.reload();
            return;
        }
        this.redirectTo(sef.utils.makeTokenHash('', true));
    },

    onViewportReady: function() {
        this.gotoHome();
        //open message task

    },

    destroyMsgTask: function() {
        if (this._task != null) {
            this._task.destroy();
            this._task = null;
            delete this._task;
        }
    },

    onViewportBeforeDestroy: function() {
        this.destroyMsgTask();
    }
});