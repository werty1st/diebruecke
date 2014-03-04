var handlebars = require('handlebars');
var baseurl = "http://localhost:5984/diebruecke/_design/b2/";



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
    list = handlebars.templates['list_item.html']({items: items, baseurl: baseurl});


    var context = {title: "Die Brücke 2 Backend Editor", knusper: list}
    html = handlebars.templates['base.html'](context);

    send(html); 
    //send(JSON.stringify(context));
    //send(list);
}

//http://localhost:5984/diebruecke/_design/b2/_list/getDatajsonPerson/personen/
exports.getDatajsonPerson = function (head, req) {
    var header = {};
    var items = {};
    
    header['Content-Type'] = 'application/json; charset=utf-8';
    start({code: 200, headers: header});


    while(row = getRow()){
        if (row.value.type == "person"){
            var slug = row.value.slug;

            items[slug] = row.value;
        }
    }

    send(JSON.stringify(items)); 

}

//http://localhost:5984/diebruecke/_design/b2/_list/getDatajsonPersonwithMedia/personwithmedia/
exports.getDatajsonPersonwithMedia = function (head, req) {
    var header = {};
    var personen = {};
    var media = {};
    var knusper = [];
    
    header['Content-Type'] = 'application/json; charset=utf-8';
    start({code: 200, headers: header});


    while(row = getRow()){       
        if (row.value.type == "person"){
            var p = row.value;
            personen[p.slug] = p;
        }

        if (row.value.type == "video" || row.value.type == "image"){
            var m = row.value;

            if (!media[m.ownerslug]) media[m.ownerslug]=[];
            media[m.ownerslug].push(m);
        }
        knusper.push(row);
    }

    for(var person in personen) {
        personen[person].media = media[person];
    }
    send(JSON.stringify(personen));
}

//http://localhost:5984/diebruecke/_design/b2/_list/getDatajsonMedia/media/
exports.getDatajsonMedia = function (head, req) {
    var header = {};
    var items = {};
    
    header['Content-Type'] = 'application/json; charset=utf-8';
    start({code: 200, headers: header});


    while(row = getRow()){
        if (row.value.type == "video" || row.value.type == "image"){
            var slug = row.value.ownerslug;

            if (items[slug] == undefined) items[slug] =  [];
            items[slug].push(row.value);
        }
    }

    send(JSON.stringify(items)); 

}