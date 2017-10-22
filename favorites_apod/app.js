var express = require('express'),
  load = require('express-load'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser');

;
global.db = mongoose.createConnection('mongodb://localhost:27017/fav_apod', {
  useMongoClient: true,
  /* other options */
});

app.set('views', __dirname + '/views');
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

load('models').then('controllers').then('routes').into(app);

app.listen(3000, function(){
  console.log("apod server");
});


