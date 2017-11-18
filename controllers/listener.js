module.exports = function (app) {

    var listenerController = {

    };

    var requestDate = getTodayDate();
    requestDate = requestDate.year + "-" + requestDate.month + "-" + requestDate.day;

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
                console.log(resp.statusCode);
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

        var notificationKey = "apod";

        var payload = {
            notification: {
                title: "NASA APOD app",
                body: date + ", new APOD available!"
            }
        };

        admin.messaging().sendToDeviceGroup(notificationKey, payload).then(function (response) {
            console.log("Successfully sent message:", response);
            var requestDate = getTomorrowDate();
            requestDate = requestDate.year + "-" + requestDate.month + "-" + requestDate.day;
            requestApod(requestDate);
        }).catch(function (error) {
            console.log("Error sending message:", error);
            requestApod(requestDate);
        });
    }

    function getTodayDate() {
        var d = new Date();
        return d.year + "-" + d.month + "-" + d.day;
    }

    function getTomorrowDate() {
        var d = new Date();
        d.setDate(today.getDate()+1);
        return { day: parseInt(d.getDate()), month: parseInt(d.getMonth()), year: parseInt(d.getFullYear()) };
    }


    return listenerController;
}
