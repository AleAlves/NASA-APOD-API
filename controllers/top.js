module.exports = function (app) {

    var apodModel = app.models.apod;
    var deviceModel = app.models.device;

    var TopController = {
        top: function (req, res) {

            console.log("Lista de favoritos" + req.body.listSize);

            var listSize = req.body.listSize;

            getCount();

            function getCount() {
                deviceModel.find().count(function (error, count) {
                    getTopRated();
                });
            }

            function getTopRated() {
                apodModel.find({}).limit(parseInt(listSize)).sort({ averageRate: -1 }).select({
                    id: 1,
                    date: 1,
                    explanation: 1,
                    hdurl: 1,
                    media_type: 1,
                    service_version: 1,
                    title: 1,
                    url: 1,
                    averageRate: 1,
                    votes: 1
                }).exec(function (error, callback) {
                    res.send(callback);
                });
            }
        },

        device: function (req, res) {
            console.log("Lista de melhores para device" + req.body.listSize);

            var listSize = req.body.listSize;
            var deviceName = req.body.deviceName;

            getCount();

            function getCount() {
                deviceModel.find().count(function (error, count) {
                    getDeviceTopRated();
                });
            }

            function getDevices() {
                deviceModel.find({ 'deviceName': deviceName }).select({
                    _id: 1
                }).exec(function (error, callback) {
                    if (dev)
                        getDeviceTopRated(callback);
                });
            }

            function getDeviceTopRated(id) {
                apodModel.find({ 'deviceId': id }).limit(parseInt(listSize)).sort({ averageRate: -1 }).select({
                    id: 1,
                    date: 1,
                    explanation: 1,
                    hdurl: 1,
                    media_type: 1,
                    service_version: 1,
                    title: 1,
                    url: 1,
                    averageRate: 1,
                    votes: 1
                }).exec(function (error, callback) {
                    if (dev)
                        console.log("Lista de melhoores avaliacoes");
                    res.send(callback);
                });
            }
        }

    };
    return TopController;
};
