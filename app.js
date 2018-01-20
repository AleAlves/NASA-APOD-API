
var express = require('express'),
  load = require('express-load'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  helmet = require('helmet'),
  admin = require("firebase-admin"),
  assert = require('assert');

global.dev = process.env.DEV;
global.version = process.env.VERSION;
global.database_link = process.env.ATLAS;
global.firebase = process.env.FIREBASE_PASSWD;
global.pushServiceOnline = process.env.PUSH;

console.log("Dev:" + dev);
console.log("Push:" + pushServiceOnline);
console.log("Atlas: " + database_link);
console.log("Firebase: " + firebase);
console.log("Version: " + version);
var serviceAccount = require(firebase);

global.admin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var database = null;
if (dev) {
  database = 'mongodb://localhost:27017/database';
}
else {
  database = database_link;
}
var uri = database_link;
var options = { promiseLibrary: require('bluebird'), useMongoClient: true };
global.db = mongoose.createConnection(uri, options);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(helmet());
load('models').then('controllers').then('routes').into(app);

app.listen(8080, function () {
  console.log("apod server version: " + version);
  console.log("dev:" + dev);
});



