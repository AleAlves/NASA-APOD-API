module.exports = function (app) {

    var pushModel = app.models.push;

    var firebaseController = {
        push: function (req, res) {
            console.log(req.body);

            var registrationToken = "/topics/apod";

            var payload = {
                notification: {
                    title: "NASA APOD app",
                    body: "new APOD available!"
                }
            };

            if (pushServiceOnline) {
                admin.messaging().sendToDevice(registrationToken, payload).then(function (response) {
                    console.log("Successfully sent message:", response);
                    res.send("Done");
                }).catch(function (error) {
                    console.log("Error sending message:", error);
                    res.send("Fail");
                });
            }
        }
    };
    return firebaseController;
}
