var express = require('express');
var app = express();
var server = require('http').createServer(app);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/bubbles', function(req, res) {
  res.sendFile(__dirname + '/bubbles.html');
})

server.listen(process.env.port || 3000, function() {
  console.log('app listening on port: ' + this.address().port);
});
