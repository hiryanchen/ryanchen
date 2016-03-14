var express = require('express');
var router = express.Router();

var myName = 'Ryan Chen';

router.get('/', function(req, res, next) {
  res.render('index', { title: myName, name: myName });
});

router.get('/me', function(req, res, next) {
  res.render('me', {name: myName});
});

router.get('/redirect', function (req, res, next) {
  res.statusCode = 302;
  res.setHeader('Location', 'http://dash.edgesuite.net/envivio/dashpr/clear/Manifest.mpd');
  res.end();
});

module.exports = router;
