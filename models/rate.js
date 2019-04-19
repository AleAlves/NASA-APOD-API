module.exports = function (app) {

    var schema = require('mongoose').Schema;

    var raters = schema({

        uid: { type: String, unique: true, riquered: true }
    
    }, { usePushEach: true });

    var rate = schema({

        date: { type: String, unique: true, riquered: true },
        pic: { type: String, riquered: true },
        rates: [raters]
    
    }, { usePushEach: true });

    return db.model('rate', rate);
}