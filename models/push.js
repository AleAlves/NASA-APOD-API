
module.exports = function (app) {
    
        var schema = require('mongoose').Schema;
    
        var data = schema({
            title: { type: String, riquered: true},
            body: { type: String, riquered: true}

        })

        var push = schema({
            to: { type: String, riquered: true, unique: true },
            notification: [data]
        })
    
        return db.model('push', push);
    }
