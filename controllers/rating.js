module.exports = (app) => {

    const jsonWebToken = require('jwt-simple');

    var rateModel = app.models.rate;

    return RatingController = {

        favorites: function (req, res) {

            console.log("Favorites");

            let user = jsonWebToken.decode(req.headers.token, jsonWebTokenSecret);

            rateModel.findOne({
                'rates.uid': user.uid
            }).select({
                'date': 1,
                'pic': 1
            }).sort({
                'date': 1
            }).exec(function (error, response) {

                if (error) {

                    httpResponse.status = HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR;
                    res.send(httpResponse);
                } else {

                    console.log("Favorites response");
                    console.log(JSON.stringify(response));

                    var httpResponse = {
                        favorites: response,
                        status: HTTP_STATUS.SUCESS.OK
                    };

                    res.send(httpResponse);
                }

            });
        },

        favorite: function (req, res) {

            let user = jsonWebToken.decode(req.headers.token, jsonWebTokenSecret);

            var httpResponse = {
                favorite: false,
                status: HTTP_STATUS.SUCESS.OK
            };

            rateModel.findOne({
                    'date': req.body.date,
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

                        httpResponse.favorite = true;

                        res.send(httpResponse);
                    }
                });
        },

        rate: function (req, res) {

            var httpResponse = {
                favorite: false,
                status: HTTP_STATUS.SUCESS.OK
            };

            let user = jsonWebToken.decode(req.headers.token, jsonWebTokenSecret);

            let rater = {
                uid: user.uid
            };

            rateModel.findOne({
                    'date': req.body.date
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

                        rate.date = req.body.date;
                        rate.pic = req.body.pic;
                        rate.rates.push(rater);

                        console.log("\nRate Model: \n" + JSON.stringify(rate));

                        rateModel.create(rate, function (error, response) {

                            if (error) {
                                console.log("\nCreated errr: \n" + JSON.stringify(error));

                                httpResponse.status = HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR;

                                res.send(httpResponse);

                            } else {
                                console.log("\nCreated Rate: \n" + JSON.stringify(response));

                                httpResponse.favorite = true;

                                res.send(httpResponse);
                            }
                        });
                    } else {
                        console.log("\nHandle  Rater: \n");

                        rateModel.findOne({
                            'date': req.body.date,
                            'rates.uid': user.uid
                        }).select({}).exec(function (error, rate) {
                            if (error) {

                                httpResponse.status = HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR;

                                res.send(httpResponse);
                            } else if (rate == null) {

                                response.rates.push(rater);

                                console.log("\n+ Rater: \n" + JSON.stringify(response));
                                response.save(function (error, sucess) {

                                    httpResponse.favorite = true;

                                    res.send(httpResponse);
                                });
                            } else {
                                console.log("\n+ Rater: \n" + JSON.stringify(rate));

                                rate.rates.pop(rate.rates.uid);

                                console.log("\n- Rater: \n" + JSON.stringify(rate));
                                rate.save(function (error, sucess) {

                                    httpResponse.favorite = false;

                                    res.send(httpResponse);
                                });
                            }
                        });
                    }
                });
        }
    }
}