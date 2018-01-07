Ext.define('abp.component.page.AppPageCtl', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.apppagectl',
    control: {
        '#':{
            beforeshow:'onbeforeshow'
        }

    },
    onbeforeshow:function(view){
        console.log('onbeforeshow',view);
        var hashObj=view.hashObj;
        var viewName=hashObj.viewName;
        var layout = view.getLayout();
      
        if(viewName&&viewName==='form')
        {
            var activeItem = layout.setActiveItem(1);
        }
        else{
            var activeItem = layout.setActiveItem(0);
        }
    },

    onSwitchPage: function (item, data) {
        console.log('data', data);
        var view = this.getView();
        var layout = view.getLayout();
        var activeItem = layout.setActiveItem(item);
        activeItem.pageData=data;

    }
});