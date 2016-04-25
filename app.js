var express = require('express'),
    Habitat = require('habitat'),
    compression = require('compression'),
    helmet = require('helmet'),
    cors = require('cors'),
    throng = require('throng'),
    bodyParser = require('body-parser'),
    Bitly = require('bitly'),
    ExpressBrute = require('express-brute'),
    RedisStore = require('express-brute-redis');

Habitat.load();

var app = express(),
    env = new Habitat(),
    bitly = new Bitly(env.get('TOKEN')),
    port = env.get('PORT'),
    redisUrl = env.get('REDIS_URL'),
    workers = env.get('WEB_CONCURRENCY') || 1,
    proxyDepth = env.get('PROXY_DEPTH') || 0,
    allowedOrigin = env.get('ALLOWED_ORIGIN');

var store;
if (redisUrl) {
  redisUrl = require('redis-url').parse(redisUrl);
  redisUrl.host = redisUrl.hostname;
  redisUrl.auth_pass = redisUrl.password;
  store = new RedisStore(redisUrl);
} else {
  store = new ExpressBrute.MemoryStore();
}
var bruteforce = new ExpressBrute(store, {
  proxyDepth: proxyDepth
});

app.enable('trust proxy');

// support json encoded bodies
app.use(bodyParser.json());
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());
app.use(compression());
app.use(cors({
  origin: allowedOrigin
}));
app.use(helmet.hsts({
  maxAge: 90 * 24 * 60 * 60 * 1000 // 90 days
}));

app.post('/generate/', bruteforce.prevent, function(req, res) {
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

throng({
  workers,
  start: function() {
    app.listen(port);
    console.log('Server started! At http://localhost:' + port);
  }
});
