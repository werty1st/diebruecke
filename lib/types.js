 var Type = require('couchtypes/types').Type,
    fields = require('couchtypes/fields'),
    widgets = require('couchtypes/widgets');
    permissions = require('couchtypes/permissions');


exports.comment = new Type('comment', {
    permissions: {
        add: permissions.loggedIn(),
        update: permissions.usernameMatchesField('creator'),
        remove: permissions.usernameMatchesField('creator')
    },
    fields: {
        creator: fields.creator(),
        text: fields.string({
            widget: widgets.textarea({cols: 40, rows: 10})
        })
    }
});

exports.blogpost = new Type('blogpost', {
    fields: {
        created: fields.createdTime(),
        title: fields.string(),
        text: fields.string({
            widget: widgets.textarea({cols: 40, rows: 10})
        })
    }
});


exports.person = new Type('person', {
    fields : { 
        first_name: fields.string(),
        last_name: fields.string()
    }   
});