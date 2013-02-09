/*
|--------------------------------------------------------------------------
| Global App View
|--------------------------------------------------------------------------
*/
App.Views.App = Backbone.View.extend({
	initialize: function() {
		$("#editContact").hide();
		vent.on('contact:edit', this.editContact, this);

		var addContactView = new App.Views.AddContact({ collection: App.contacts });

		var allContactsView = new App.Views.Contacts({ collection: App.contacts });
		$('#allContacts').append(allContactsView.render().el);
	},

	editContact: function(contact) {
		var editContactView = new App.Views.EditContact({ model: contact });
		$('#editContact').html(editContactView.el);
	}
});


/*
|--------------------------------------------------------------------------
| Add Contact View
|--------------------------------------------------------------------------
*/
App.Views.AddContact = Backbone.View.extend({
	el: '#addContact',

	initialize: function() {
		this.first_name = $('#first_name');
		this.last_name = $('#last_name');
		this.mobile_number = $('#mobile_number');
		this.email_address = $('#email_address');
	},

	events: {
		'submit': 'addContact'
	},

	addContact: function(e) {
		e.preventDefault();

		this.collection.create({
			first_name: this.first_name.val(),
			last_name: this.last_name.val(),
			email_address: this.email_address.val(),
			mobile_number: this.mobile_number.val()
		}, { wait: true });
		this.clearForm();
	},

	clearForm: function() {
		this.first_name.val('');
		this.last_name.val('');
		this.mobile_number.val('');
		this.email_address.val('');
	}
});


/*
|--------------------------------------------------------------------------
| Edit Contact View
|--------------------------------------------------------------------------
*/
App.Views.EditContact = Backbone.View.extend({
	template: template('editContactTemplate'),

	initialize: function() {
		this.render();

		this.form = this.$('form');
		this.first_name = this.form.find('#edit_first_name');
		this.last_name = this.form.find('#edit_last_name');
		this.mobile_number = this.form.find('#edit_mobile_number');
		this.email_address = this.form.find('#edit_email_address');
	},

	events: {
		'submit form': 'submit',
		'click button.cancel': 'cancel'
	},

	submit: function(e) {
		e.preventDefault();

		this.model.save({
			first_name: this.first_name.val(),
			last_name: this.last_name.val(),
			mobile_number: this.mobile_number.val(),
			email_address: this.email_address.val()
		});

		this.remove();
		$("#editContact").hide();
		$("#addContact").show();
	},

	cancel: function() {
		this.remove();
		$("#editContact").hide();
		$("#addContact").show();		
	},

	render: function() {
		var html = this.template( this.model.toJSON() );

		this.$el.html(html);
		return this;
	}
});


/*
|--------------------------------------------------------------------------
| All Contacts View
|--------------------------------------------------------------------------
*/
App.Views.Contacts = Backbone.View.extend({
	tagName: 'tbody',

	initialize: function() {
		this.collection.on('add', this.addOne, this);
	},

	render: function() {
		this.collection.each( this.addOne, this );
		return this;
	},

	addOne: function(contact) {
		var contactView = new App.Views.Contact({ model: contact });
		this.$el.append(contactView.render().el);
	}
});


/*
|--------------------------------------------------------------------------
| Single Contact View
|--------------------------------------------------------------------------
*/
App.Views.Contact = Backbone.View.extend({
	tagName: 'tr',

	template: template('allContactsTemplate'),

	initialize: function() {
		this.model.on('destroy', this.unrender, this);
		this.model.on('change', this.render, this);
	},

	events: {
		'click a.delete': 'deleteContact',
		'click a.edit'  : 'editContact'
	},

	editContact: function() {
		vent.trigger('contact:edit', this.model);
		$("#addContact").hide();
		$("#editContact").show();
	},

	deleteContact: function() {
		this.model.destroy();
	},

	render: function() {
		this.$el.html( this.template( this.model.toJSON() ) );
		return this;
	},

	unrender: function() {
		this.remove();
	}
});