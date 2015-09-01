var express = require('express');
var router = express.Router();

var myName = 'Ryan Chen';

router.get('/', function(req, res, next) {
  res.render('index', { title: myName, name: myName });
});

router.get('/me', function(req, res, next) {
  res.render('me', {name: myName});
});

module.exports = router;
