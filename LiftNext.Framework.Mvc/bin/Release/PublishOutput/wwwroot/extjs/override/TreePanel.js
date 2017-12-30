Ext.tree.Panel.override({
	/**
	 * @method initComponent
	 * @inheritdoc
	 * @return {void}
	 */
	initComponent: function() {
		//this.debug(arguments);
		
		this.callParent(arguments);
		if(this.columns){
			this.columns[0].textAlign='left';
		}
		//debugger;
		//console.log(this.columns);

	}
});