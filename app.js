
var express = require('express'),
  load = require('express-load'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  helmet = require('helmet'),
  admin = require("firebase-admin");

global.version = "4.5.0";
global.dev = process.env.DEV;
global.database_link = process.env.ATLAS;
global.pushServiceOnline = process.env.PUSH;

console.log("EV: " + database_link);
console.log("EV:" + pushServiceOnline);

var serviceAccount = require("./nasa-apod-app-797fd-firebase-adminsdk-vpwzc-6da49d69c5.json");

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

// database = database_link;

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
  console.log("apod server version: " + version);
  console.log("dev:" + dev);
});



