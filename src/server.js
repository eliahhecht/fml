var http = require('http')
var express = require("express")
var pug = require('pug')
var app = express()
var roster = require('./roster')

var PORT = 8081

var server = http.createServer(app)
server.listen(PORT)

var rosterTemplate = pug.compileFile("pug/roster.pug")

// serve static files
var staticFileDir = __dirname + "/../public"
app.use(express.static(staticFileDir))

app.get('/', function(req, res){
  roster.loadRoster(/* memberId */ 1, function(memberRoster){
    var data = {
      playerName: 'Test',
      roster: memberRoster
    }
    res.send(rosterTemplate(data))
  })
})

app.post('/card_status/', function(req, res){
  roster.updateRoster(
    req.params.memberId,
    req.params.cardName,
    req.params.status,
    function(success){
      if (success){
        res.send("ok")
      } else {
        res.status(400);
        res.send('None shall pass');
      }
    }
  )
})

// Console will print the message
console.log('Server running at http://127.0.0.1:%d/', PORT)
