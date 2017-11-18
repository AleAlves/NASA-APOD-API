module.exports = function (app) {

    var listenerController = {

    };

    let yyyymmdd = require('yyyy-mm-dd');
    var requestDate = getTodayDate();
    requestDate = requestDate.year + "-" + requestDate.month + "-" + requestDate.day;

    requestApod(requestDate);

    function requestApod(requestDate) {
        setTimeout(() => {
            if (requestDate == yyyymmdd()) {
                checkTodayApod(requestDate);
            }
            else {
                requestApod(requestDate);
            }
        }, 1800000);

        function checkTodayApod(date) {

            const https = require('https');
            var hasApod = false;
            var date = yyyymmdd();
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
        return { day: parseInt(d.getDate()), month: parseInt(d.getMonth()+1), year: parseInt(d.getFullYear()) };
    }

    function getTomorrowDate() {
        var d = new Date();
        d.setDate(today.getDate()+1);
        return { day: parseInt(d.getDate()), month: parseInt(d.getMonth()), year: parseInt(d.getFullYear()) };
    }


    return listenerController;
}
