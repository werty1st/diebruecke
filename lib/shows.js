/**
 * Show functions to be exported from the design doc.
 */

var templates = require('duality/templates');
var handlebars = require('handlebars');



exports.welcome = function (doc, req) {
    return {
        title: 'It worked!',
        content: templates.render('welcome.html', req, {})
    };
};

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

exports.detail_view_update = function (doc, req) {
    return {
        body : JSON.stringify(doc),
        headers : {
            "Content-Type" : "application/json; charset=utf-8"
            }
    }   
};



exports.detail_view = function(doc, req) {

    return {
        body : JSON.stringify(doc),
        headers : {
            "Content-Type" : "application/json; charset=utf-8"
            }
    }   

};