var express = require('express'),
    Habitat = require('habitat'),
    compression = require('compression'),
    helmet = require('helmet'),
    cors = require('cors'),
    rateLimit = require('express-rate-limit'),
    bodyParser = require('body-parser');

Habitat.load();

var app = express(),
    env = new Habitat(),
    Bitly = require('bitly'),
    bitly = new Bitly(env.get('TOKEN')),
    port = env.get('PORT'),
    allowedOrigin = env.get('ALLOWED_ORIGIN');

app.enable('trust proxy');

// support json encoded bodies
app.use(bodyParser.json());
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Just going to start with default rate limit config.
app.use(rateLimit());
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: allowedOrigin
}));
app.use(helmet.hsts({
  maxAge: 90 * 24 * 60 * 60 * 1000 // 90 days
}));

app.post('/generate/', function(req, res) {
  var earlOfUrl = req.body.url;
  if (!earlOfUrl) {
    res.send("");
  }
  bitly.shorten(earlOfUrl).then(function(response) {
    var short_url = response.data.url;
    res.send(short_url);
  }, function(error) {
    throw error;
  });
});

app.listen(port);
console.log('Server started! At http://localhost:' + port);
