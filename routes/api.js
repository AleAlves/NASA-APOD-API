module.exports = function (app) {

    var rateController = app.controllers.rate;
    var topController = app.controllers.top;

    app.post('/api/rate', rateController.rate);
    app.get('/api/top', topController.top);
  
  }