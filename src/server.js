var http = require('http')
var express = require("express")
var pug = require('pug')
var app = express()

var PORT = 8081

var server = http.createServer(app)
server.listen(PORT)

var rosterTemplate = pug.compileFile("pug/roster.pug")

app.get('/', function(req, res){
  var data = {
    playerName: 'Test',
    cards: ['Black Lotus', 'Mox Diamond']
  }
  res.send(rosterTemplate(data))
})

// Console will print the message
console.log('Server running at http://127.0.0.1:%d/', PORT)
