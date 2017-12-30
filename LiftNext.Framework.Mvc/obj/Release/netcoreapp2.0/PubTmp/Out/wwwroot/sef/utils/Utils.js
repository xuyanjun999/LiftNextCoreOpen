//Utils.js



Ext.define('sef.core.utils.Utils', {
        //检测是否为中文
        isCnText: function(str) {
            var reg = /^[\u4E00-\u9FA5]+$/;
            return reg.test(str);
        },
        //设置浏览器标题
        setDocTitle: function(title) {
            document.title = title;
        },

        formatError: function(errResult) {
            var err = {
                    code: 0,
                    message: '',
                    source: errResult
                }
                //debugger;
            if (errResult) {
                if (errResult.$className === 'Ext.data.Batch') {
                    var berr = errResult.exceptions[0];
                    if (Ext.isObject(berr.error)) {
                        err.code = berr.error['status'];
                        if (err.code === 404) {
                            err.message = Ext.String.format('未找到指定的服务'); //, errResult.request.url);
                        }
                    } else if (Ext.isString(berr.error)) {
                        err.message = berr.error;
                    }
                } else if (errResult['request']) {
                    //原生请求
                    err.code = errResult['status'];
                    //err.message=errResult['statusText'];
                    if (err.code === 404) {
                        err.message = Ext.String.format('未找到指定的服务\n{0}', errResult.request.url);
                    }else{
                        err.message=errResult.statusText;
                    }
                    
                } else {
                    err.message = errResult.Message;
                }

            }

            return err;
        },

        makeTokenHash: function(token, appendTicks) {
            if (Ext.isEmpty(token)) {
                token = '/dashboard';
            } else if (/^sef\./.test(token)) {
                //with a class name
                token = token.replace(/^sef\.app/g, '.app');
                token = token.replace(/^sef\.core/g, '.core');
                token = token.replace(/\./gi, '/');
            }
            if (appendTicks === true) {
                token += '?_t=' + (+new Date());
            }
            return token;
        },

        //将字符型HASH值转换成对象
        decodeHash: function(hashStr) {
            /*
            HASH SAMPLE
            =======================
            /app/sys/User
            /app/sys/User?view=List&Id=1

            /core/view/Setting
            /core/view/Setting?view=Form&Id=2

            */

            var hObj = {
                str: hashStr,
                qObj: {},
                appName: '',
                appCls: '',
                appId: '',
                viewName: '' //Form|List|Report
            };

            if (Ext.isEmpty(hashStr)) {
                hashArr = "dashboard?t=" + new Date();
            }
            if (/\/dashboard/.test(hashStr)) {
                var dashboard = sef.runningCfg.get('Dashboard', 'sef.app.liftnext.dashboard.DefaultDashboard');
                dashboard = dashboard.replace('sef.', '.');
                dashboard = dashboard.replace(/\./g, '/');
                hashStr = dashboard;
            }
            ///dashboard?_t=1502848955813
            ///app/liftnext/system/customer/Customer
            //console.log('hashArr####',hashStr);
            var hashArr = hashStr.split('?');

            hObj.appName = hashArr[0];
            if (hashArr.length > 1) {
                //hObj.qObj=hashArr[1];
                var qStr = hashArr[1];
                var qObj = Ext.Object.fromQueryString(qStr);
                //hObj.qObj = {};
                for (var p in qObj) {
                    var cp = p.toLowerCase();
                    hObj.qObj[cp] = qObj[p];
                }
                delete qObj;
                qObj = null;
                hObj.viewName = hObj.qObj['viewname'];
            }

            if (/^\/app/.test(hObj.appName) || /^\/core/.test(hObj.appName)) {
                var name = hObj.appName.replace(/^\/app/, 'sef/app');
                name = name.replace(/^\/core/, "sef.core");
                hObj.appName = name;
                hObj.appCls = name.replace(/\//g, ".");
                hObj.appId = hObj.appCls.replace(/\./g, '_').toLowerCase();
            }

            return hObj;

        },

        //将对象转换成字符串
        encodeHash: function(hashObj, qObj) {
            if (!hashObj) return '';
            if (Ext.isString(hashObj)) {
                var str = hashObj;
                hashObj = {
                    str: '',
                    qObj: {}
                };

                //sef.app.sys.User
                str = str.replace(/^sef\.app/, '.app');
                str = str.replace(/^sef\.core/, '.core');
                str = str.replace(/\./g, '/');
                hashObj.str = str;

            }

            var _qobj = Ext.merge({}, hashObj.qObj);
            qObj = qObj || {};
            for (var p in qObj) {
                //_qobj[p.toLowerCase()]=qObj[p];
                var lp = p.toLowerCase();
                var o = {};
                o[lp] = qObj[p];
                Ext.apply(_qobj, o);
            }

            var qString = Ext.Object.toQueryString(_qobj);

            var oldStr = hashObj.str.split('?')[0];
            if (Ext.isEmpty(qString)) {
                return oldStr;
            }
            return oldStr + '?' + qString;
        },

        getModelMeta: function(model) {
            var entity = null;
            if (Ext.isString(model)) {
                entity = Ext.data.schema.Schema.instances.default.getEntity(model);
            } else {
                entity = model;
            }

            var fields = entity.getFields();
            var metas = [];
            fields.forEach(function(f, i) {
                var ctype = f.getSType();

                var cfg = {
                    isId: f.name === entity.idProperty,
                    invisible: f.invisible === true,
                    name: f.name,
                    text: f.text || f.name,
                    type: ctype,
                    sassb: f.sassb,
                    index: f.index,
                    assoName: ''
                };
                if (cfg.isId) {
                    cfg['type'] = 'bigint';
                }

                if (ctype === 'DateTime') {
                    cfg['renderer'] = sef.utils.dateRenderer;
                }

                if (ctype === 'enum') {
                    cfg['renderer'] = sef.utils.enumRenderer(f.sassb);
                }
                // console.log(cfg);

                metas.push(cfg);
            });

            metas.sort(function(m1, m2) {
                return m1.index - m2.index;
            });

            //console.log('metas#',metas);

            return metas;
        },

        // month/day/year
        dateRenderer: function(v) {
            return Ext.util.Format.date(v, 'm/d/Y');
        },
        //hour:min:sec
        timeRenderer: function(v) {
            return Ext.util.Format.date(v, 'H:i:s');
        },

        relRenderer: function(field) {
            return function(v) {
                if (v) return v[field];
                return 'N/A';
            }
        },

        enumRenderer: function(enumType) {
            return function(v) {
                //window.sef_static_data.SEF_Core_Common_TestEnum
                var types = enumType.split(',');
                var enumName = types[0];
                enumName = enumName.replace(/\./g, '_');

                var data = window.sef_static_data[enumName];
                var tv = '';

                //console.log('#####>',enumType,v);
                data.forEach(function(dv) {
                    if (dv.Value === v) {
                        tv = dv.Text;
                        return false;
                    }
                });
                return tv;
            }
        },

        // month/day/year h:m:s
        dateTimeRenderer: function(v) {
            return Ext.util.Format.date(v, 'm/d/Y H:i:s');
        },

        makeRadialMenu: function(id,items, pos) {
            var html = [];
            
            var style = ['position:fixed;z-index:9999'];//.join(';');
            pos=pos||{};
            for(var p in pos){
                var pv=pos[p];
                if(!/px$/.test(pv)){
                    pv=pv+'px';
                }
                style.push(p+':'+pv);
            }
            html.push('<div style="'+style.join(';')+'">');
            html.push('<div class="sef-radial-menu sef-radial-menu-sm sef-radial-menu-' + items.length + '"');
            html.push(' id="'+id+'" ');
            //html.push(' style="' + style + '" ');
            html.push('>');
            html.push(' <div class="btn-menu trigger">');
            html.push('<span class="line"></span>');
            html.push('</div>');
            html.push('<div class="icons">');
            items.forEach(function(item) {
                html.push('<div class="rotater">');
                html.push('<div class="btn-menu btn-menu-icon">');
                html.push('<a href="javascript:__process_radial_menu_cmd(\'customcmd\',\'' + item.cmd + '\')">');
                if (item.icon) {
                    html.push('<i class="fa ' + item.icon + '"></i>');
                } else {
                    html.push('<p>' + item.text + '</p>');
                }
                html.push('</a>');
                html.push('</div>');
                html.push('</div>');
            });
            html.push('</div>');
            html.push('</div>');
            html.push('</div>');
            return html.join('');
            //$(html.join('')).appendTo('#user_menu');
        },

        ajax: function(opt) {
                var cfg = Ext.merge({
                    method: 'POST',
                    timeout:60*1000,
                    defaultHeaders: {
                        'x-sef': 'true',
                        'ID': sef.runningCfg.getUser().ID,
                        'TOKEN': sef.runningCfg.getUser().Token
                    }
                }, opt);
                var success = cfg['success'];
                var failure = cfg['failure'];
                var scope = cfg['scope'];
                delete cfg['success'];
                delete cfg['failure'];
                delete cfg['scope'];

                return Ext.Ajax.request(cfg)
                    .then(function(resp, opts) {
                        //console.log(resp,opts);
                        var o = Ext.JSON.decode(resp.responseText);
                        if (o.Success === true) {
                            if (success) {
                                success.call(scope, o.Result, o);
                            }
                        } else {
                            failure && failure.call(scope, sef.utils.formatError(o));
                        }
                        //console.log(o);

                    }, function(errResp, opts) {
                        //console.log('failure#', errResp);
                        //debugger;
                        if (failure) {
                            failure.call(scope, sef.utils.formatError(errResp));
                        }
                    });
        },

        showInputDialog: function (title, action) {
            var dialog = Ext.create('sef.core.components.window.BaseDialog', {
                width: '500px',
                height: '250px',
                title: '请输入'+title+'(不可为空)',
                xtype: 'sef-formpanel',
                layout: 'fit',
                defatuls: {
                    margin: '0 0px 0px 0px',
                    xtype: 'textfield',
                    labelAlign: 'top',
                    labelSeparator: ''
                },
                items: [{
                    xtype: 'textarea',
                    itemId: 'InputValue',
                    columnWidth: 1
                }]
            });
            dialog.on('willclosedialog', function (state, result) {
                var review = dialog.down('#InputValue').getValue();
                if (review === "") {
                    sef.dialog.error("请输入" + title);
                    return false;
                }
                action(review);
                return true;
                this.updateLayout();
            }, this);
            dialog.show();
        }

    },
    function(cls) {
        if (!sef.utils) {
            sef.utils = new cls();
        }
    });


function __process_radial_menu_cmd(tag, c) {
    var hash = location.hash;
    var newHashSection = tag + '=' + c;
    if (hash) {
        //debugger;
        var reg = new RegExp('(&?)(' + tag + '=\\w{1,})(&?)', 'gi');
        //console.log(reg,newHashSection);
        if (reg.test(hash)) {
            hash = hash.replace(reg, '$1' + newHashSection + '$3');
        } else {
            if(hash.indexOf('?')<0)hash+='?'+newHashSection;
            else hash += '&' + newHashSection;
        }
        //s.replace(/(&?)(action=\w{1,})(&?)/,"$1action=99$3")

        //hash+='&action='+c;
    } else {
        hash = newHashSection;
    }
    location.hash = hash;
    //console.log(hash,c);
}