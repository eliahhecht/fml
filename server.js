var http = require('http')
var express = require("express")
var app = express()

var PORT = 8081

var server = http.createServer(app)
server.listen(PORT)

app.get('/', function(req, res){
   var data = {}
   res.send("hello")
})

// Console will print the message
console.log('Server running at http://127.0.0.1:%d/', PORT)
