Ext.define('abp.component.page.FormPageCtl', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.formpagectl',
    control:{
        '#':{
            activate:'onactivate'
        }
    },
    onactivate:function(){
        var me=this;
        var view=this.getView();
        var layout = view.getLayout();
        var items= layout.getLayoutItems();
        Ext.each(items,function(item){
            item.fireEvent('activate');
        });
    }
   
});