module.exports = function (app) {

    var apodModel = app.models.apod;
    var deviceModel = app.models.device;

    var TopController = {
        top: function (req, res) {


            console.log("Lista de favoritos");

            getCount();

            function getCount() {
                deviceModel.find().count(function (error, count) {
                    getTopRated(count);
                });
            }

            function getTopRated(count) {
                apodModel.find({}).limit(10).sort({ averageRate: -1 }).select({
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
        },
    };
    return TopController;
};
