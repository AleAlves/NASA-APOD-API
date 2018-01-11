
var express = require('express'),
  load = require('express-load'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  helmet = require('helmet'),
  admin = require("firebase-admin");

global.dev = false;
global.user = process.env.XABLAU;

console.log("EV: "+process.env.XABLAU);
global.version = "4.0.4";

var config = {
  apiKey: "AIzaSyA9ci6gRvrszwCafUjEtpaKdfJtkyQy_5Q",
  authDomain: "nasa-apod-app-797fd.firebaseapp.com",
};

var serviceAccount = require("./nasa-apod-app-797fd-firebase-adminsdk-vpwzc-6da49d69c5.json");

global.admin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var database = null;
if (dev) {
  database = 'mongodb://localhost:27017/database';
}
else {
  database = 'mongodb://ale-api:dovaHkiin@apodratewebapp-shard-00-00-b0o6a.mongodb.net:27017,apodratewebapp-shard-00-01-b0o6a.mongodb.net:27017,apodratewebapp-shard-00-02-b0o6a.mongodb.net:27017/databse?ssl=true&replicaSet=apodRateWebApp-shard-0&authSource=admin';
}

global.db = mongoose.createConnection(database, {
  useMongoClient: true
});


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(helmet());
load('models').then('controllers').then('routes').into(app);

app.listen(8080, function () {
  console.log("apod server version: "+ version);
  console.log("dev:" + dev);
});



