var handlebars = require('handlebars');


//http://localhost:5984/diebruecke/_design/b2/_list/list_Personen/personen/
exports.list_Personen = function (head, req) {
    var header = {};
    var items = [];
	
    header['Content-Type'] = 'text/html; charset=utf-8';
    start({code: 200, headers: header});

    var list = "empty";
    while(row = getRow()){
    	items.push(row.value);
    }
    list = handlebars.templates['list_item.html']({items: items});

    var context = {title: "My New Post", list: list}
    //var html    = templates.render('base.html', req, context);
    html = handlebars.templates['base.html'](context);

    send(html); 

}

