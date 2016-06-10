var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');

app.use(express.static('public'));

app.get('/users', function(req, res) {
  var filePath = path.resolve('./export', 'users.json');
  var fileContents = fs.readFileSync(filePath, { encoding: 'utf8'});
  var parsedContents = JSON.parse(fileContents);
  res.send(parsedContents);
});

app.get('/channels', function(req, res) {
  var filePath = path.resolve('./export', 'channels.json');
  var fileContents = fs.readFileSync(filePath, { encoding: 'utf8'});
  var parsedContents = JSON.parse(fileContents);
  res.send(parsedContents);
});

app.get('/channel/:name', function(req, res) {
  var directoryPath = path.resolve('./export', req.params.name);
  var directoryListing = fs.readdirSync(directoryPath);
  var days = [];

  directoryListing.forEach(function(file, index) {
    var filePath = path.resolve(directoryPath, file);
    var fileContents = fs.readFileSync(filePath, { encoding: 'utf8'});
    var parsedContents = JSON.parse(fileContents);
    console.log('stuff from a day', parsedContents);
    days.push(parsedContents);
  });

  console.log('days', days);
  res.send(days);
});

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});
