module.exports = function (app) {

    var apodModel = app.models.apod;

    var HomeController = {
        index: function (req, res) {
            res.render('home/index');
        },
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
                                var device = apod.device;
                                device.push(deviceJson);
                                apod.save(function () {
                                    res.send("Novo Apod Criado com sucesso");
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
                                "device.model_name": 1,
                                "device.rate_value": 1,
                                "device.manufacturer": 1
                            }
                        }], function (error, deviceProjection) {
                            if (deviceProjection.length == 0) {
                                var device = apod.device;
                                device.push(deviceJson);
                                apod.save(function () {
                                    res.send("Device criado com sucesso num apod");
                                });
                            }
                            else {
                                var device = apod.device.id(deviceProjection);
                                apodModel.findById(deviceProjection[0]._id, function (error, apod) {
                                    var device = apod.device.id(deviceProjection[0].device._id);
                                    device.rate_value = deviceJson.rate_value;
                                    apod.save(function () {
                                        res.send("avalicao  atualizada");
                                    })
                                });
                            }
                        })
                    }
                });
        },

        top: function (req, res) {
            apodModel.aggregate([
                { $unwind: "$device" },
                { $match: { "device.rate_value": 9 } },
                {
                    $project: {
                        "_id": 1,
                        "copyright": 1,
                        "date": 1,
                        "explanation": 1,
                        "hdurl": 1,
                        "media_type": 1,
                        "service_version": 1,
                        "title": 1,
                        "url": 1
                    }
                }], function (error, top) {
                    var rates;
                    var count;
                    for (count = 0; count < top.length; count++) {
                        console.log(top[count].device);
                    }
                    res.send(top);
                });
        }
    };
    return HomeController;
};

function log(data) {
    console.log("Log: " + data);
}