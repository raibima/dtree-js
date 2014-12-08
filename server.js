var express = require('express');
var tests = require('./test');

var app = express();

app.get('/', function(req, res) {
  res.json(tests[8]());
});

app.listen(3000);