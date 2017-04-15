// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');

var databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var dashboard = new ParseDashboard({
  "apps": [
    {
      "serverURL": "https://localhost:1337/parse",
      "appId": process.env.APP_ID || "myAppId",
      "masterKey": process.env.MASTER_KEY || "myMasterKey",
      "appName": "MyApp"
    }
  ]
});

var api = new ParseServer({
  serverURL: "https://your-app-name.herokuapp.com/parse",
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '' //Add your master key here. Keep it secret!
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);
app.use('/dashboard', dashboard);

app.get('/', function(req, res) {
  res.status(200).send('I dream of being a web site.');
});

var httpServer = require('http').createServer(app);
httpServer.listen(port);
