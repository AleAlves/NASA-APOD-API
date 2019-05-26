module.exports = (app) => {

  const ServiceController = app.controllers.service;
  const LoginController = app.controllers.login;
  const APODController = app.controllers.apod;
  const RatingController = app.controllers.rating;

  const api_v1 = '/api/v1';

  //API 
  app.get('/', ServiceController.index);
  app.get(api_v1 + '/version', ServiceController.version);

  //Login
  app.get(api_v1 + '/init',LoginController.init);
  app.post(api_v1 + '/ticket',LoginController.ticket);
  app.post(api_v1 + '/login',LoginController.login);
  app.delete(api_v1 + '/delete',LoginController.delete);  

  //APOD
  app.post(api_v1+'/apod', APODController.apod);

  //Rating
  app.post(api_v1+'/rate', RatingController.rate);
  app.post(api_v1+'/favorite', RatingController.favorite);
  app.post(api_v1+'/favorites', RatingController.favorites);
  
  
}