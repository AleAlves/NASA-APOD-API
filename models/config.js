module.exports = function (app) {

    var schema = require('mongoose').Schema;

    var config = schema({

        dailyAPOD: { type: String, unique: true, riquered: false },
    
    }, { usePushEach: true });

    return db.model('config', config);
}