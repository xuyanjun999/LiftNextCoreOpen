//RunningCfg

Ext.define('sef.core.utils.RunningCfg', {
    privates: {
        __storeID: '__sef__ld__',
        _rawData: null,

        _ld: null,
        _user: {
            ID: 0,
            Token: '',
            Name: '',
            Email: '',
            Code:'',
            CompanyId: 0,
            IsSuperAdmin:false
        }
    },

    loginDialogIsShowing:false,

    FILE_TYPES: {
        CSV: 2,
        EXCEL: 4,
        WORD: 8,
        PDF: 16
    },

    //搜索操作符
    searchOperator: {
        '<': 1,
        '<=': 2,
        '>': 3,
        '>=': 4,
        '==': 5,
        'like': 6,
        'in': 7,
        'not in': 8,
        '!=': 9,

        LessThan: 1, //小于
        LessThanOrEqual: 2, //小于或等于
        GreaterThan: 3, //大于
        GreaterThanOrEqual: 4, //大于或等于
        Equal: 5, //等于
        Like: 6, //类似..
        In: 7, //在...范围区间
        NotIn: 8, //不在...范围区间
        NotEqual: 9 //不等于
    },

    //逻辑关系枚举
    logicalRelOperator: {
        And: 1,
        Or: 2,
        Not: 3
    },


    BUTTONS: {
        CREATE: {
            text: '创建',
            xtype: 'sef-actionbutton',
            actionName: 'create',
            btnType: 'primary',
            dataAction: false
        },
        EDIT: {
            text: '编辑',
            xtype: 'sef-actionbutton',
            actionName: 'edit',
            btnType: 'default',
            dataAction: true
        },
        DELETE: {
            text: '删除',
            xtype: 'sef-actionbutton',
            actionName: 'delete',
            btnType: 'default',
            dataAction: true
        },
        REFRESH: {
            text: '刷新',
            command: 'refresh',
            xtype: 'sef-actionbutton',
            actionName: 'refresh',
            btnType: 'default',
            dataAction: false
        },
        EXPORT: {
            text: '导出',
            xtype: 'sef-actionbutton',
            actionName: 'export',
            btnType: 'default',
            dataAction: false
        },
        SAVE: {
            text: '保存',
            xtype: 'sef-actionbutton',
            actionName: 'save',
            btnType: 'primary',
            dataAction: false
        },
        EDIT_INFORM: {
            text: '编辑',
            xtype: 'sef-actionbutton',
            actionName: 'edit',
            btnType: 'default',
            dataAction: true
        },
        DEL_INFORM: {
            text: '删除',
            xtype: 'sef-actionbutton',
            actionName: 'delete',
            btnType: 'default',
            dataAction: true
        },
        PRINT: {
            text: '打印',
            xtype: 'sef-actionbutton',
            actionName: 'print',
            btnType: 'default',
            dataAction: true
        },
        COPY: {
            text: '复制',
            xtype: 'sef-actionbutton',
            actionName: 'print',
            btnType: 'default',
            dataAction: true
        }
    },



    update: function (newCfg) {
        if (!this._rawData) {
            this._rawData = window.__sg__sef_runningcfg__;
        }
        if (newCfg) {
            Ext.apply(this._rawData, newCfg);
        }
        //console.log('#rawData',this.rawData);
    },

    get: function (key, dftValue) {
        var v = this._rawData && this._rawData[key];
        if (v) return v;
        return dftValue;
    },

    getUser: function () {
        return this._user;
    },

    getLang: function () {
        var lang = this.getLocal('LANG', false) || this.get('LANG');
        return lang;
    },

    getUIMode: function () {
        var uiMode = this.getLocal('UIMode', false) || this.get('DefaultUIMode');
        return uiMode;
        //if(uiMode===0)return ''
    },

    changeUIMode: function (newMode) {
        if (!newMode) {
            newMode = this.getUIMode() === 'l-t' ? 't-b' : 'l-t';
        }
        this.addLocal('UIMode', newMode);

    },

    changeLang: function (newLang) {
        if (!newLang) {
            newLang = this.getLang() === 'cn' ? 'en' : 'cn';
        }
        this.addLocal('LANG', newLang);
        //console.log('will change lang to ===>',newLang);
    },

    setUser: function (u) {
        if (u) {
            Ext.apply(this._user, u);
            this.addLocal('LAST_LOGIN_USER', this._user);
        }

    },

    clearUser: function (silient) {
        var id = this.getUser().ID;

        this.setUser({
            ID: 0,
            Token: '',
            Name: ''
        });
        if (silient !== true) {
            var url = sef.runningCfg.get('LogoutApi', '/api/logout');
            sef.utils.ajax({
                url: url,
                method: 'POST',
                jsonData: {
                    UserID: id
                },
                success: function () {
                    if(sef.runningCfg.loginDialogIsShowing===true)return;
                    
                    window.location.reload();
                }

            });
        } else {
            window.location.reload();
        }
    },

    getTitle: function () {

        return this._rawData && this._rawData['Title'];
    },

    getVersion: function () {

    },

    addLocal: function (key, value) {
        if (Ext.isString(value)) {
            this._ld.setItem(key, value);
        } else {
            this._ld.setItem(key, Ext.JSON.encode(value));
        }
    },

    getLocal: function (key, decode) {
        var v = this._ld.getItem(key);
        if (v) {
            if (decode !== false) {
                v = Ext.JSON.decode(v);
            }
        }
        return v;
    },

    init: function () {
        this.update();
        //debugger;
        this._ld = Ext.util.LocalStorage.get(this.__storeID);
        if (this._ld == null) {
            //console.log('will new a store id');
            this._ld = new Ext.util.LocalStorage({
                id: this.__storeID
            });
        }

        var u = this.getLocal('LAST_LOGIN_USER');
        this.setUser(u);
    },


    initCfg: function (cb) {
        var url = this._rawData.ProfileApi;
        //console.log(url);
        sef.utils.ajax({
            url: url,
            method: 'GET',
            //scope:this,
            success: function (result, resp) {
                sef.runningCfg.update(result);

                //console.log('success#',result,this);
                cb && cb(true);
            },
            failure: function (err, resp) {
                //console.log('failure#',err,cb);
                cb && cb(false, err);
            }
        });
    }

}, function (cfgCls) {
    if (!sef.runningCfg) {
        sef.runningCfg = new cfgCls();
        sef.runningCfg.init();
    }

});