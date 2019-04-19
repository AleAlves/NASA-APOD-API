module.exports = (app) => {

    const jsonWebToken = require('jwt-simple');

    var rateModel = app.models.rate;

    return RatingController = {

        status: function (req, res) {

            let user = jsonWebToken.decode(req.headers.token, jsonWebTokenSecret);

            var httpResponse = {
                like: false,
                status: HTTP_STATUS.SUCESS.OK
            };

            rateModel.findOne({
                    'date': req.body.rate.date,
                    'rates.uid': user.uid
                },
                function (error, response) {
                    if (error) {

                        console.log("\nRate status: \n" + JSON.stringify(error));

                        httpResponse.status = HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR;

                        res.send(httpResponse);
                    } else if (response == null) {

                        console.log("\nRate status: \n" + JSON.stringify(response));

                        res.send(httpResponse);
                    } else {

                        console.log("\nRate status: \n" + JSON.stringify(response));

                        httpResponse.like = true;

                        res.send(httpResponse);
                    }
                });
        },

        rate: function (req, res) {

            var httpResponse = {
                status: HTTP_STATUS.SUCESS.OK
            };

            let user = jsonWebToken.decode(req.headers.token, jsonWebTokenSecret);

            let rater = {
                uid: user.uid
            };

            rateModel.findOne({
                    date: req.body.rate.date
                },
                function (error, response) {
                    if (error) {

                        console.log("\nRate: \n" + JSON.stringify(error));

                        httpResponse.status = HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR;

                        res.send(httpResponse);

                    } else if (response == null) {

                        console.log("\nRate Request: \n" + JSON.stringify(response));

                        let rate = Object();
                        rate.rates = Array();

                        rate.date = req.body.rate.date;
                        rate.pic = req.body.rate.pic;
                        rate.rates.push(rater);

                        console.log("\nRate Model: \n" + JSON.stringify(rate));

                        rateModel.create(rate, function (error, response) {

                            if (error) {
                                console.log("\nCreated errr: \n" + JSON.stringify(error));

                                httpResponse.status = HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR;

                                res.send(response);

                            } else {
                                console.log("\nCreated Rate: \n" + JSON.stringify(response));

                                res.send(response);
                            }
                        });
                    } else {
                        console.log("\nHandle  Rater: \n");

                        rateModel.findOne({
                            'rates.uid': user.uid
                        }).select({}).exec(function (error, rate) {
                            if (error) {

                                httpResponse.status = HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR;

                                res.send(httpResponse);
                            } else if (rate == null) {

                                response.rates.push(rater);

                                console.log("\n+ Rater: \n" + JSON.stringify(response));
                                response.save(function (error, sucess) {
                                    res.send(sucess);
                                });
                            } else {
                                console.log("\n+ Rater: \n" + JSON.stringify(rate));

                                rate.rates.pop(rate.rates.uid);

                                console.log("\n- Rater: \n" + JSON.stringify(rate));
                                rate.save(function (error, sucess) {
                                    res.send(sucess);
                                });
                            }
                        });
                    }
                });
        }
    }
}