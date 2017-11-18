module.exports = function (app) {

    var rateController = app.controllers.rate;
    var topController = app.controllers.top;
    var firebaseController = app.controllers.firebase;
    var listenerController = app.controllers.listener;

    app.post('/api/push', firebaseController.push);
    app.get('/api/push', firebaseController.push);
    app.post('/api/rate', rateController.rate);
    app.get('/api/top', topController.top);
    app.get('/', rateController.index);
  
  }