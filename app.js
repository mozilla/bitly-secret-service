var express = require('express'),
    Habitat = require('habitat'),
    compression = require('compression'),
    helmet = require('helmet'),
    cors = require('cors'),
    throng = require('throng'),
    bodyParser = require('body-parser'),
    Bitly = require('bitly'),
    redis = require('redis'),
    redisRateLimiter = require('redis-rate-limiter'),
    redisOpts;

Habitat.load();

var app = express(),
    env = new Habitat(),
    bitly = new Bitly(env.get('TOKEN')),
    port = env.get('PORT'),
    redisUrl = env.get('REDIS_URL'),
    workers = env.get('WEB_CONCURRENCY') || 1,
    proxyDepth = env.get('PROXY_DEPTH') || 0,
    allowedOrigin = env.get('ALLOWED_ORIGIN');

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

function getXForwardedFor(request) {
  var ips = request.get('X-Forwarded-For').split(/ *, */);
  return ips[0];
}

if (redisUrl) {
  redisOpts = require('redis-url').parse(redisUrl);
  redisOpts.host = redisOpts.hostname;
  app.use(redisRateLimiter.middleware({
    redis: redis.createClient(redisOpts),
    key: env.get('LIMIT_USING_X_FORWARED_FOR') ? getXForwardedFor : 'ip',
    rate: env.get('RATE_LIMIT') || '30/minute'
  }));
}

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

throng({
  workers,
  start: function() {
    app.listen(port);
    console.log('Server started! At http://localhost:' + port);
  }
});
