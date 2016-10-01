var http = require('http')
var express = require("express")
var pug = require('pug')
var app = express()

var PORT = 8081

var server = http.createServer(app)
server.listen(PORT)

app.get('/', function(req, res){
  var data = {
    player_name: 'Test',
    cards: ['Black Lotus', 'Mox Diamond']
  }
  var template = pug.compileFile("pug/roster.pug")
  res.send(template(data))
})

// Console will print the message
console.log('Server running at http://127.0.0.1:%d/', PORT)
