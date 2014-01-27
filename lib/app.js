/*
 * Values exported from this module will automatically be used to generate
 * the design doc pushed to CouchDB.
 */


 var Type = require('couchtypes/types').Type,
    fields = require('couchtypes/fields'),
    widgets = require('couchtypes/widgets');


module.exports = {
    updates: require('./updates'),
    shows: require('./shows'),
    validate_doc_update: require('./validate'),
	//http://localhost:5984/diebruecke/_design/b2/_view/byType
	views : {
	    byType: {
	        map: function (doc) {
	            if (doc.type)
	                emit(doc.type, doc._id);
	        }
	    }
	}
};





/*
// updates: require('./updates'),
// filters: require('./filters'),
// validate_doc_update: require('./validate')
//types: require('./types'),
// bind event handlers
// require('./events');*/