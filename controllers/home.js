module.exports = function (app) {

    var apodModel = app.models.apod;

    var HomeController = {
        index: function (req, res) {
            res.render('home/index');
        },
        
        // User rate

        rate: function (req, res) {
            var apodJson = req.body.apod;
            var deviceJson = req.body.device;
            apodModel.findOne({ date: apodJson.date },
                function (error, apod) {
                    if (error) {
                        log("Error - " + error);
                    }
                    else if (apod == null) {
                        apodModel.create(apodJson, function (error, apod) {
                            if (error) {
                                log("Error - " + error);
                            }
                            else {
                                apod.averageRate = deviceJson.rateValue;
                                var device = apod.device;
                                device.push(deviceJson);
                                apod.save(function () {
                                    console.log("Device criado com sucesso num apod recem criado");
                                    res.send("Device");
                                });
                            }
                        });
                    }
                    else {
                        apodModel.aggregate([{ $unwind: "$device" },
                        { $match: { "date": apodJson.date, "device.imei": deviceJson.imei } },
                        {
                            $project: {
                                "_id": 1,
                                "device._id": 1,
                                "device.imei": 1,
                                "device.modelName": 1,
                                "device.rateValue": 1,
                                "device.manufacturer": 1
                            }
                        }], function (error, deviceProjection) {
                            if (deviceProjection.length == 0) {
                                var device = apod.device;
                                device.push(deviceJson);
                                apod.save(function () {
                                    updateAvaregeRate(apod);
                                    console.log("Device criado com sucesso num Apod");
                                    res.send("Device criado com sucesso num Apod");
                                });
                            }
                            else {
                                var device = apod.device.id(deviceProjection);
                                apodModel.findById(deviceProjection[0]._id, function (error, apod) {
                                    var device = apod.device.id(deviceProjection[0].device._id);
                                    device.rateValue = deviceJson.rateValue;
                                    apod.save(function () {
                                        updateAvaregeRate(apod);
                                        console.log("avaliacao atualizada");
                                        res.send("avalicao  atualizada");
                                    })
                                });
                            }
                        })
                    }
                });
        },

        // Get Top 10

        topRated: function (req, res) {
            apodModel.find().limit(10).sort({ averageRate: -1 }).select({
                date: 1,
                explanation: 1,
                hdurl: 1,
                media_type: 1,
                service_version: 1,
                title: 1,
                url: 1,
                averageRate: 1
            }).exec(function (error, callback) {
                console.log("Lista de favoritos");
                res.send(callback);
            });
        },
    };
    return HomeController;
};

function log(data) {
    console.log("Log: " + data);
}



function updateAvaregeRate(apod) {
    console.log("\nRate:\n");
    var i;
    var sum = 0;
    for (i = 0; i < apod.device.length; i++) {
        sum = sum + apod.device[i].rateValue;
    }
    console.log("soma: " + sum + " media:" + sum / i);
    apod.averageRate = sum;
    apod.save(function () {
        console.log("Avaliacao media atualizada");
    });
}

