Ext.define('abp.component.page.AppPageCtl', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.apppagectl',
    control: {
        '*': {
            switchPage: 'onSwitchPage'
        },

    },

    onSwitchPage: function (item, data) {
        console.log('data', data);
        var view = this.getView();
        var layout = view.getLayout();
        var activeItem = layout.setActiveItem(item);
        activeItem.pageData=data;

    }
});