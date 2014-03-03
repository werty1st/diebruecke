exports.personen = {
        map: function (doc) {
            if (doc.type == "person")
                emit(doc.type, doc);
        }
    };
exports.media = {
        map: function (doc) {
            if (doc.type == "media")
                emit([doc.type,doc.ownerslug,doc.freischaltepisode, doc.mediatype], doc);
        }
    };


exports.byType = {
        map: function (doc) {
            if (doc.type)
                emit(doc.type, doc._id);
        }
    };

exports.nonType = {
        map: function (doc) {
            if (!doc.type)
                emit(doc._id, null);
        }
    };