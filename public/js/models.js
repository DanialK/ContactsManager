App.Models.Contact = Backbone.Model.extend({
	validate: function(attrs) {
		if ( ! attrs.first_name || ! attrs.last_name ) {
			return 'A first and last name are required.';
		}

		if ( ! attrs.email_address ) {
			return 'Please enter a valid email address.';
		}

		if( isNaN(attrs.mobile_number) == true ){
			return 'Please enter a valid number';
		}
	},
	idAttribute : "_id",
	urlRoot: "/contacts",
	defaults : {
		_id: null
	}
});