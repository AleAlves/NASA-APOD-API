
module.exports = function (app) {

    var schema = require('mongoose').Schema;

    var device = schema({
        imei: { type: String, riquered: true, unique: true },
        deviceName: String,
        screenSize: String,
        manufacturer: String,
    })

    return db.model('device', device);
}