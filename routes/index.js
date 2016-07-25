var express = require('express');
var router = express.Router();

var myName = 'Ryan Chen';

router.get('/', function(req, res, next) {
  res.render('index', { title: myName, name: myName });
});

router.get('/:path', function(req, res, next) {
  res.render(req.params.path, {name: myName});
});

router.get('/redirect.mpd', function (req, res, next) {
  res.statusCode = 302;
  res.setHeader('Location', 'http://dash.edgesuite.net/envivio/dashpr/clear/Manifest.mpd');
  res.end();
});

module.exports = router;
