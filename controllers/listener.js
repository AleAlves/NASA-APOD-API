
module.exports = function (app) {

    var listenerController = {

    };

    var requestDate = getTodayDate();

    requestApod(requestDate);

    function requestApod(requestDate) {
        setTimeout(() => {
            if (requestDate == getTodayDate()) {
                checkTodayApod(requestDate);
            }
            else if(requestDate < getTodayDate()){
                if(dev){
                console.log("date < today: "+ requestDate);
                }
                requestDate = getTodayDate();
                if(dev){
                console.log("updated: "+ requestDate);
                }
                requestApod(requestDate);
            }
            else {
                requestApod(requestDate);
                if(dev){
                console.log("new req:"+ requestDate);
                }
            }
        }, 3600000);

        // 1800000 - meia hora

        function checkTodayApod(date) {

            const https = require('https');
            var hasApod = false;
            https.get('https://api.nasa.gov/planetary/apod?api_key=NTZlQrZD1ugcnmBxdBPa56kbYXut0sEhZen5fMbN&date=' + date, (resp) => {
                if(dev){
                console.log("Request: " + date + " Status code: " + resp.statusCode + " - " + Date());
                }
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
            console.log("now req one date:"+ getTomorrowDate());
            requestApod(getTomorrowDate())
        }).catch(function (error) {
            console.log("Error sending message:", error)
            requestApod(date)
        });
    }

    function getTodayDate() {
        var d = new Date();
        return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
    }

    function getTomorrowDate() {
        var d = new Date();
        d.setDate(d.getDate() + 1);
        return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
    }

    return listenerController;
}
