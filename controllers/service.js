
module.exports = function (app) {

    var ServiceController = {

        index: function (req, res) {
            res.render('home/index', { v: version });
        },

        version: function (req, res) {
            if (dev) {
                console.log("Req");
            }
            var data = new Object();
            data.version = version;
            res.send(JSON.stringify(data));
        }
    };
    return ServiceController;
}