
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
global.firebase = process.env.FIREBASE_PASSWD;
global.pushServiceOnline = process.env.PUSH;

var serviceAccount = require(firebase);

global.admin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var database = process.env.ATLAS || 'mongodb://localhost:27017/database';

var uri = database_link;
var options = { promiseLibrary: require('bluebird'), useMongoClient: true };
global.db = mongoose.createConnection(uri, options);
Band = db.model('band-promises', { name: String });

db.on('open', function () {
  assert.equal(Band.collection.findOne().constructor, require('bluebird'));
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
load('models').then('controllers').then('routes').into(app);

app.listen(8080, function () {
  console.log("Dev:" + dev);
  console.log("Push:" + pushServiceOnline);
  console.log("Atlas: " + database);
  console.log("Firebase: " + firebase);
  console.log("Version: " + version);
});



