module.exports = (app) => {

    const axios = require('axios');
    var configModel = app.models.config;

    requestApod(getTodayDate());

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

        setInterval(() => {

            console.log("setTimeout:  ");

            configModel.findOne({
                dailyAPOD: requestDate
            }, function (error, response) {

                if (response == null) {

                    checkTodayApod(requestDate);
                }
                else{
                    console.log("Request: "+ requestDate);
                    
                    requestApod(requestDate);
                }
            });
        }, 3600);

        // one hour - 3600000

        function checkTodayApod(date) {

            console.log("date:  " + date);

            axios.get('https://api.nasa.gov/planetary/apod?api_key=' + nasa_api_key + "&date=" + date)
                .then(response => {
                    console.log("\nAPOD verify: \n" + response);

                    console.log("\nRequest: " + date + " Status code: " + response.status + " - " + Date());

                    if (response.status == 200) {

                        sendPush(date, response.data);
                    } else {

                        requestApod(date);
                    }

                })
                .catch(error => {

                    console.log("\nError: " + error);
                    requestApod(date);
                });
        }
    }

    function sendPush(date, apod) {

        var topic = "/topics/DailyAPOD";

        let payload = {
            notification: {
                title: "NASA APOD App",
                body: "new " + apod.media_type + " available! "
            }
        };

        firebaseAdmin.messaging().sendToDevice(topic, payload).then(function (response) {

            console.log("Successfully sent message:", response);
        
            let config = {
                dailyAPOD: date
            };

            configModel.findOne({}, function (error, response) {

                if (response == null) {

                    configModel.create(config, function (error, response) {
                
                        requestApod(getTomorrowDate())
                    });

                } else {
                    
                    response.dailyAPOD = date;
                    response.save(function(error, done){
                
                        requestApod(getTomorrowDate());
                    });
                }

            });
        }).catch(function (error) {

            console.log("Error sending message:", error)
            requestApod(getTodayDate())
        });
    }

    function getTodayDate() {

        let date = new Date();
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }

    function getTomorrowDate() {
        let date = new Date();
        date.setDate(date.getDate() + 1);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }
}