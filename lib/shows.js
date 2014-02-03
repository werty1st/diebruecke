var handlebars = require('handlebars');


exports.not_found = function (doc, req) {
    return {
        title: '404 - Not Found',
        content: templates.render('404.html', req, {})
    };
};

// exports.my_form = function (doc, req) {
//     var myForm = new Form (person);
//     return {
//       title : 'My First Form',
//       content: templates.render('form.html', req, {
//             form_title : 'My Form',
//             method : 'POST',
//             action : '../_update/update_my_form',
//             form : myForm.toHTML(req),
//             button: 'Validate'})
//     }
// };

exports.detail_view_edit = function (doc, req) {

    var user_details = handlebars.templates['details_item_edit.html']({doc: doc});

    var context = {title: "My New Post", content: user_details}
    //var html    = templates.render('base.html', req, context);
    html = handlebars.templates['base.html'](context);

    return {
        body : html,
        headers : {
            "Content-Type" : "text/html; charset=utf-8"
            }
    } 
};

exports.detail_view = function(doc, req) {
    var user_details = handlebars.templates['details_item.html']({doc: doc, user: {authenticated: true}});

    var context = {title: "My New Post", content: user_details}
    //var html    = templates.render('base.html', req, context);
    html = handlebars.templates['base.html'](context);

    return {
        body : html,
        headers : {
            "Content-Type" : "text/html; charset=utf-8"
            }
    }   

};