/**
 * Values exported from this module will automatically be used to generate
 * the design doc pushed to CouchDB.
 */

exports.updates = {
    
};

exports.views = {
    allslugs: {
        map: function (doc) {
        	if (doc.type == "person")
            	emit(doc.slug, null);
        }
    }
};

/*
// updates: require('./updates'),
// filters: require('./filters'),
// validate_doc_update: require('./validate')
//types: require('./types'),
// bind event handlers
// require('./events');
*/