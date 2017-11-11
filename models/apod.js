module.exports = function (app) {

    var schema = require('mongoose').Schema;

    var rate = schema({
        deviceId: { type: String, required: true},
        rateValue: { type: Number, required: true }
    });

    var apod = schema({
        id : { type: Number, unique: true, riquered: true },
        copyright: { type: String, required: false },
        date: { type: String, unique: true, riquered: true },
        explanation: { type: String, required: true },
        hdurl: { type: String, required: false },
        mediaType: { type: String, required: false },
        serviceVersion: String,
        title: { type: String, required: true },
        url: { type: String, required: true },
        averageRate: { type: Number, required: false },
        votes: Number,
        rates: [rate]
    });

    return db.model('apod', apod);
}

