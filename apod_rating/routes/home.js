module.exports = function(app){
  var home = app.controllers.home;
  app.get('/', home.index);
  app.put('/api/rate', home.rate);
  app.get('/api/topRated', home.topRated);
}