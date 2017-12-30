//AbstractDynamicFormPanel

Ext.define('sef.core.components.form.ReviewForm', {
    extend: 'Ext.container.Container',
    xtype: 'sef-reviewform',
    config: {
    },

    privates: {
    },

    loadReviewContent: function () {
        var me = this; 
        var pform = me.up('sef-complexprojectform');
        var projectId = pform._id;
        var formCard = me.up('sef-formpanel');
        if (formCard) {
            var code = formCard.formCode;
            sef.utils.ajax({
                url: 'Design/GetProjectReviewContent',
                method: 'POST',
                paramAsJson: true,
                jsonData: {
                    projectId: projectId,
                    code: code
                },
                scope: me,
                success: function (result) {
                    //console.log(result);
                    var html = '';
                    if (!result || result.length == 0) {
                        html = "<span style='font-style: italic'>无评审内容</span>";
                    } else {
                        html = "<table border='0' cellspacing='0' cellpadding='0' width='100%'>";
                        result.forEach(function (item) {
                            item.ProjectReviewSteps.forEach(function (step) {
                                html += "<tr>";
                                html += "<td width='80%' style='padding:5px;'><B>" + item.ReviewTypeName + "</B>&nbsp;从&nbsp;<B>" + step.StepName + "</B>&nbsp;到&nbsp;<B>" + step.NextStepName + "</B>&nbsp;,&nbsp;[意见] : " + step.ReviewDesc + "</td>";
                                html += "<td width='20%' style='text-align:right;padding:0px; font-style: italic'>" + step.ReviewUser + "&nbsp;/&nbsp;" + Ext.Date.format(new Date(step.ReviewDate), 'Y-m-d H:i') + "</td>";
                                html += "</tr>";
                            });
                        });
                        html += "</table>";
                    }
                    me.down('#review_content').setHtml(html);
                    //console.log(result, me.down('#review_content'))
                },
                failure: function (err, resp) {
                    sef.dialog.error(err.message);
                    console.log('error', err);
                }
            });
        }
    },

    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            xtype: 'container',
            columnWidth: 1,
            layout: 'fit',
            items: [{
                xtype: 'component',
                itemId: 'review_content',
                html:''
            }]
        });
        this.callParent(arguments);
        var me = this;
        this.on('afterlayout', function () {
            me.loadReviewContent();
        }, null, {
                single: true
        });
    }
});