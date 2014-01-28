var templates = require('duality/templates');
var handlebars = require('handlebars');


//http://localhost:5984/diebruecke/_design/b2/_list/list_Personen/personen/
exports.list_Personen = function (head, req) {
    var header = {};
	
    header['Content-Type'] = 'application/xhtml+xml; charset=utf-8';
    start({code: 200, headers: header});
    
    while(row = getRow()){


           
    }
    
    var context = {title: "My New Post", body: JSON.stringify(req)}
    var html    = templates.render('base.html', req, context);
    send(html); 

}

