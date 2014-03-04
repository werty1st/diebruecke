exports.personen = {
        map: function (doc) {
            if (doc.type == "person")
                emit(doc.type, doc);
        }
    };
exports.media = {
        map: function (doc) {
            if (doc.type=="video" || doc.type=="image")
                emit(["media",doc.ownerslug,doc.freischaltepisode, doc.type], doc);
        }
    };

exports.personwithmedia = {
        map: function (doc) {
            if (doc.type=="person" || doc.type=="video" || doc.type=="image")
                emit(doc.type, doc);
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