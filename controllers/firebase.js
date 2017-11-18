module.exports = function (app) {

    var pushModel = app.models.push;

    var firebaseController = {
        push: function (req, res) {
            console.log(req.body);

            var registrationToken = "dFRSA5sUqgE:APA91bElAtpY85A08fal0zqw5PexFHMsWK4WpwYX9h-sTGQy0QAVdPRiQGTPgjevPWyRNgOn9jVeE7b2lsogjyxlBo-Pc21sV_JYbZxclcC3iLDi-KQCqCYAwWqDhnPVTBBEosEHCSDX";

            var payload = {
                notification: {
                    title: "NASA APOD app",
                    body: "new APOD available!"
                }
            };

            admin.messaging().sendToDevice(registrationToken, payload).then(function (response) {
                console.log("Successfully sent message:", response);
            }).catch(function (error) {
                console.log("Error sending message:", error)
            });
        }
    };
    return firebaseController;
}
