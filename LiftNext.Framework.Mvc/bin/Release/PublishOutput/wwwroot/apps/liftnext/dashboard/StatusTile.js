Ext.define('sef.app.liftnext.dashboard.StatusTile', {
    extend: 'Ext.Component',
    xtype:'sef-statustile',
    tpl:['<div class="sef-dashboard-status-tile">',
    '<tpl for=".">',
        '<div class="meta" style="width:{[100/xcount]}%">',
            '<div class="text">{text}</div>',
            '<div class="desc">{desc}</div>',
        '</div>',
    '</tpl>',
'</div>'],

    data:[]
});