exports.personen = {
        map: function (doc) {
            if (doc.type)
                emit(doc.type, doc.name);
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