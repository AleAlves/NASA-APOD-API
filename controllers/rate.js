
module.exports = function (app) {

    var apodModel = app.models.apod;
    var deviceModel = app.models.device;

    var RateController = {

        rate: function (req, res) {
            var apodObject = req.body.apod;
            var deviceObject = req.body.device;
            var rateObject = req.body.rate;

            if (apodModel != null && rateObject != null && deviceModel != null && rateObject.rateValue != 0 && rateObject.rateValue < 6) {
                deviceHandler();
            }
            else {
                res.send();
            }

            function deviceHandler() {

                deviceModel.findOne({ imei: deviceObject.imei },
                    function (error, deviceResponse) {
                        if (error) {
                            console.log("Error - device - step 1 " + error);
                        }
                        else if (deviceResponse == null) {
                            //Nao existe esse device
                            deviceModel.create(deviceObject, function (error, deviceResponse) {
                                if (error) {
                                    console.log("Error - device - step 2 " + error);
                                }
                                else {
                                    if (dev)
                                        console.log("device criado");
                                    apodHandler(deviceResponse);
                                }
                            });
                        }
                        else {
                            if (dev)
                                console.log("ja existe device");
                            apodHandler(deviceResponse);
                        }
                    });
            }

            function apodHandler(deviceResponse) {
                apodModel.findOne({ id: apodObject.id },
                    function (error, apodResponse) {
                        if (error) {
                            console.log("Error - apod - step 1 " + error);
                        }
                        else if (apodResponse == null) {
                            //Nao ha apod
                            apodModel.create(apodObject, function (error, apodResponse) {
                                if (error) {
                                    console.log("Error- apod - step 2 " + error);
                                }
                                else {
                                    rateHandler(apodResponse, deviceResponse);
                                }
                            });
                        }
                        else {
                            //existe apod
                            if (dev)
                                console.log("ja existe apod");
                            rateHandler(apodResponse, deviceResponse);
                        }
                    });
            }

            function rateHandler(apod, device) {
                var query = apodModel.findOne({ "id": apod.id, 'rates.deviceId': device._id });
                query.select({});
                query.exec(function (error, apodResponse) {
                    if (dev)
                        console.log("Rate");
                    if (error) {
                        console.log("Error - rate - step 1 " + error);
                    }
                    else {
                        if (apodResponse == null) {
                            var rates = apod.rates;
                            rateObject.deviceId = device._id;
                            rates.push(rateObject);
                            apod.save(function (error, apodResponse) {
                                if (error) {
                                    console.log("Error - rate - step 1 " + error);
                                }
                                else {
                                    if (dev)
                                        console.log("rate cirado");
                                    updateAvaregeRate(apodResponse);
                                }
                            });
                        }
                        else {
                            apodResponse.rates[0].rateValue = rateObject.rateValue;
                            apodResponse.save(function (error, apodResponse) {
                                if (error) {
                                    console.log("Error - rate - step 2 " + error);
                                }
                                else {
                                    if (dev)
                                        console.log("rate atualizado");
                                    updateAvaregeRate(apodResponse);
                                }
                            });
                        }
                    }
                });
            }

            function updateAvaregeRate(apod) {

                var i;
                var sum = 0;
                for (i = 0; i < apod.rates.length; i++) {
                    sum = sum + apod.rates[i].rateValue;
                }

                console.log("sum: " + sum + " avarage:" + Math.round(sum / i) + " i: " + i);
                apod.averageRate = Math.round(sum / i);
                apod.votes = i++;
                apod.save(function (error) {
                    if (error) {
                        console.log("Error - Rate update - step 1");
                        response(res, false);
                    }
                    else {
                        console.log("rate media atualizado");
                        response(res, true);
                    }
                });
            }

            function response(res, status) {
                var data = new Object();
                data.done = String(status);
                console.log("___");
                console.log(JSON.stringify(data));
                res.send(JSON.stringify(data));
            }
        },
    };
    return RateController;
};