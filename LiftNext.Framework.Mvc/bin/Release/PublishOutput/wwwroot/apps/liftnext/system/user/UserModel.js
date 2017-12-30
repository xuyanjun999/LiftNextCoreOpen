Ext.define('sef.app.liftnext.system.user.UserModel',{
    extend:'sef.core.model.BaseModel',

    fields: [{
        index:1,
        name:'Code',
        text: _('编号')
    }, {
        index: 2,
        name: 'Name',
        text: _('名称')
    },{
            index:4,
            name:'Dept',
        text: _('部门')
    }, {
            index: 3,
        name: 'Company',
        text: _('公司'),
        stype: 'asso'
    }, {
            index: 5,
        name: 'Email',
        text: _('邮箱')
    }, {
            index: 6,
        name: 'Phone',
        text: _('电话')
    }, {
        index: 6,
        name: 'Region',
        text: _('区域')
    }, {
            index: 7,
            name:'PwdExpiryTime',
            text: _('密码过期'),
        type:'date'
    }, {
            index: 8,
            name:'LastLoginIp',
        text: _('登录IP')
    }, {
        index: 9,
        name: 'Pwd',
        text: _('密码')
    }, {
            name: 'AutoModifyFiled'
    }]
});