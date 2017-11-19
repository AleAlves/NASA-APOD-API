module.exports = function (app) {

    var listenerController = {

    };

    var requestDate = getTodayDate();
    console.log(requestDate);

    requestApod(requestDate);

    function requestApod(requestDate) {
        setTimeout(() => {
            if (requestDate == getTodayDate()) {
                checkTodayApod(requestDate);
            }
            else {
                requestApod(requestDate);
            }
        }, 1800);

        function checkTodayApod(date) {

            const https = require('https');
            var hasApod = false;
            https.get('https://api.nasa.gov/planetary/apod?api_key=NTZlQrZD1ugcnmBxdBPa56kbYXut0sEhZen5fMbN&date=' + date, (resp) => {
                console.log("Request: " + date + " Status code: " + resp.statusCode + " - " + Date());
                if (resp.statusCode == 200) {
                    sendPush(date);
                }
                else {
                    requestApod(date);
                }
            }).on("error", () => { });
        }
    }

    function sendPush(date) {

        var topic = "/topics/apod";
        
        var payload = {
            notification: {
                title: "NASA APOD app",
                body: "new APOD available!"
            }
        };

        admin.messaging().sendToDevice(topic, payload).then(function (response) {
            console.log("Successfully sent message:", response);
        }).catch(function (error) {
            console.log("Error sending message:", error)
        });
    }

    function getTodayDate() {
        var d = new Date();
        return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
    }

    function getTomorrowDate() {
        var d = new Date();
        d.setDate(today.getDate() + 1);
        return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
    }


    return listenerController;
}
