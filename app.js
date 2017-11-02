var express = require('express'),
  load = require('express-load'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser');

global.db = mongoose.createConnection('mongodb://ale-api:dovaHkiin@apodratewebapp-shard-00-00-b0o6a.mongodb.net:27017,apodratewebapp-shard-00-01-b0o6a.mongodb.net:27017,apodratewebapp-shard-00-02-b0o6a.mongodb.net:27017/test?ssl=true&replicaSet=apodRateWebApp-shard-0&authSource=admin', {
  useMongoClient: true,
  /* other options */
});

app.set('views', __dirname + '/views');
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

load('models').then('controllers').then('routes').into(app);

app.listen(8080, function(){
  console.log("apod server");
});


