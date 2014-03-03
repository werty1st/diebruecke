/**
 * Rewrite settings to be exported from the design doc
 */


module.exports = [

    {from: "/diebruecke/*", to: "../../*" },
    
    //{from: '/getById/json/:id/*',  to: '../../:id/*' }, 
    


    //http://localhost:5984/diebruecke/_design/b2/_view/media?startkey=["media","alexander",0,0]&endkey=["media","alexander",{},{}]
    //http://localhost:5984/diebruecke/_design/b2/_rewrite/getPersonMedia/json/alexander
    {from: '/getPersonMedia/json/:id',  to: '_view/media/', query: { startkey: ["media",":id",0,0], endkey: ["media",":id",{},{}] }}, 


    {from: '/getById/xml/:id',  to: '_show/getByID_show/:id', query: { accept: 'xml'} }, 

    {from: '/all/now/xml',  to: '_list/getNow_list/getAllWithTimeStamp', query: { accept: 'xml' }},

    {from: '/crossdomain.xml', to: 'html/crossdomain.xml'},

    //php
    //{from: '/getOlderThen30h/json', to: '_list/getOlderThen30h/getAllWithTimeStamp', query: { accept: 'json'} }, 

    
    //monitoring
    {from: '/status', to: '_list/status/getAllWithTimeStamp', query: { accept: 'json'}},

    {from: '/', to: 'index.html'},
    {from: '/wartung', to: 'html/wartung.html'},
    {from: '/modules.js', to: '/modules.js'},
    //{from: '/html/*', to: 'html/*'}

    // list:
    // http://localhost:5984/epgservice/_design/epgservice/_list/getNow_list/getAllWithTimeStamp?accept=xml&startkey=["ZDF",-24]&endkey=["ZDF",24]      
    // http://localhost:5984/epgservice/_design/epgservice/_list/getToday_list/getAllWithTimeStamp?accept=xml&startkey=["ZDF",-24]&endkey=["ZDF",24]

    // show:
    // http://localhost:5984/epgservice/_design/epgservice/_show/getByID/dbc2a00ab9ef7d59b252a8c166a17c19?accept=json


                               //_list/getNowByStation_list/getNowByStation_view?descending=false&station=zdf
    
    // {from: '/zdf/now', 		to: '_list/getNowByStation_list/getNowByStation_view', method: 'get', query: { descending: 'false', station: 'zdf'}},
    /*
    {from: '/zdfneo/now',   to: '_list/getNowByStation/getNowByStation?descending=false&station=zdfneo'},
    {from: '/zdfinfo/now',  to: '_list/getNowByStation/getNowByStation?descending=false&station=zdfinfo'},
    {from: '/zdfkultur/now',to: '_list/getNowByStation/getNowByStation?descending=false&station=zdf.kultur'},
    */


    // {from: '/static/*', to: 'static/*'},
    // {from: '/static/*', to: 'static/*'},
    // {from: '/static/*', to: 'static/*'},
    // {from: '/getnow', to: '_show/getnow'},
    // {from: '/', to: '_list/homepage'},
    // {from: '*', to: '_show/not_found'}
];