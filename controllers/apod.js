module.exports = (app) => {

    const axios = require('axios');
    var requestDate = getTodayDate();
    var configModel = app.models.config;

    requestApod(requestDate);

    return APODController = {

        apod: function (req, res) {

            console.log("\n * Date: " + req.body.date);

            axios.get('https://api.nasa.gov/planetary/apod?api_key=' + nasa_api_key + "&date=" + req.body.date)
                .then(response => {
                    console.log("\nAPOD Data: \n" + JSON.stringify(response.data));
                    let params = {
                        apod: response.data,
                        status: HTTP_STATUS.SUCESS.OK
                    };

                    sendAPOD(res, params);
                })
                .catch(error => {
                    console.log("\nError: " + error);
                    let response = {
                        status: HTTP_STATUS.BUSINESS.UNAVAILABLE_APOD
                    };
                    sendAPOD(res, response);
                });

            function sendAPOD(res, response) {
                res.send(response);
            }
        }
    }

    function requestApod(requestDate) {

        console.log("RequestApod, date: " + requestDate);

        setTimeout(() => {

            configModel.findOne({
                dailyAPOD: response.data.date
            }, function (error, response) {
                if (response == null) {

                    checkTodayApod(requestDate);
                }
            });
        }, 36000);

        // Uma hora - 3600000

        function checkTodayApod(date) {

            console.log("date:  " + date);

            axios.get('https://api.nasa.gov/planetary/apod?api_key=' + nasa_api_key + "&date=" + date)
                .then(response => {
                    console.log("\nAPOD verify: \n" + response);

                    console.log("\nRequest: " + date + " Status code: " + response.status + " - " + Date());

                    if (response.status == 200) {

                        sendPush(response.data);
                    } else {

                        requestApod(date);
                    }

                })
                .catch(error => {

                    console.log("\nError: " + error);
                    requestApod(requestDate);
                });
        }
    }

    function sendPush(response) {

        var topic = "/topics/DailyAPOD";

        var payload = {
            notification: {
                title: "NASA APOD App",
                body: "new " + response.media_type + " available! "
            }
        };

        firebaseAdmin.messaging().sendToDevice(topic, payload).then(function (response) {
            console.log("Successfully sent message:", response);
            console.log("now req one date:" + getTomorrowDate());

            let config = {
                dailyAPOD: response.data.date
            };

            configModel.findOne({

                dailyAPOD: response.data.date
            }, function (error, response) {

                if (response == null) {

                    configModel.dailyAPOD = response.data.date
                    configModel.crate(config, function (error, response) {
                        requestApod(getTomorrowDate())
                    });
                } else {
                    configModel.dailyAPOD = response.data.date
                    configModel.save();
                    requestApod(getTomorrowDate())
                }

            });
        }).catch(function (error) {
            console.log("Error sending message:", error)
            requestApod(date)
        });
    }

    function getTodayDate() {
        var d = new Date();
        return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    }

    function getTomorrowDate() {
        var date = new Date();
        date.setDate(date.getDate() + 1);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }
}