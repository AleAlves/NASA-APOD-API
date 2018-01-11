
var express = require('express'),
  load = require('express-load'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  helmet = require('helmet'),
  admin = require("firebase-admin");

console.log("EV: "+process.env.ATLAS);
console.log("EV: "+process.env.FIREBASE_PASSWD);

global.version = "4.0.5";

var serviceAccount = require(process.env.FIREBASE_PASSWD);

global.admin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var database = null;
if (dev) {
  database = 'mongodb://localhost:27017/database';
}
else {
  database = process.env.atlas;
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



