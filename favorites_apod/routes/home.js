module.exports = function(app){
  var home = app.controllers.home;
  app.get('/', home.index);
  app.post('/api/rate', home.rate);  
  app.get('/api/top', home.top);
}