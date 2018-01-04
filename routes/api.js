module.exports = function (app) {

    var rateController = app.controllers.rate;
    var topController = app.controllers.top;
    var firebaseController = app.controllers.firebase;
    var listenerController = app.controllers.listener;
    var serviceController = app.controllers.service;

    app.get('/api/version', serviceController.version);
    app.get('/api/push', firebaseController.push);
    app.post('/api/rate', rateController.rate);
    app.post('/api/top', topController.top);
    app.post('/api/device', topController.device);
    app.get('/', serviceController.index);
  
  }