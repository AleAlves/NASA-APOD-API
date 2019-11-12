module.exports = (app) => {

    var rateModel = app.models.rate;
    const cryptoUtil = app.security.crypto;

    return RatingController = {

        favorites: function (req, res) {

            console.log("Favorites");

            let user = cryptoUtil.JWT.decode(req.headers.token);

            let httpResponse = {
                status: HTTP_STATUS.SUCESS.OK
            };

            if (user == null) {
                httpResponse.status = HTTP_STATUS.CLIENT_ERROR.UNAUTHORIZED;

                res.send(httpResponse);
            } else {

                rateModel.find({
                    'rates.uid': user.uid
                }).select({
                    'date': 1,
                    'pic': 1,
                    'title': 1
                }).sort({
                    'date': -1
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
            }
        },

        favorite: function (req, res) {

            let user = cryptoUtil.JWT.decode(req.headers.token);

            let httpResponse = {
                favorite: false,
                status: HTTP_STATUS.SUCESS.OK
            };

            if (user == null) {
                httpResponse.status = HTTP_STATUS.CLIENT_ERROR.UNAUTHORIZED;

                res.send(httpResponse);
            } else {

                console.log("JWT user: \n" + JSON.stringify(user));

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
            }
        },

        rate: function (req, res) {

            var httpResponse = {
                favorite: false,
                status: HTTP_STATUS.SUCESS.OK
            };

            let user = cryptoUtil.JWT.decode(req.headers.token);

            if (user == null) {
                httpResponse.status = HTTP_STATUS.CLIENT_ERROR.UNAUTHORIZED;

                res.send(httpResponse);
            } else {

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
                            rate.title = req.body.title;
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
}