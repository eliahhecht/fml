var http = require('http')
var express = require('express')
var pug = require('pug')
var debug = require('debug')('fml:server')
var bodyParser = require('body-parser')
var path = require('path')

var app = express()
var roster = require('./roster')
var store = require('./store')()

var PORT = 8081

var server = http.createServer(app)
server.listen(PORT)

var rosterTemplate = pug.compileFile('pug/roster.pug')

// serve static files
var staticFileDir = path.join(__dirname, '/../public')
app.use(express.static(staticFileDir))

// enable POST parsing onto req.body
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  var memberId = 1
  roster.loadCardsOwnedByPlayer(memberId, function (memberRoster) {
    var data = {
      playerName: 'Test',
      roster: {
        rosterItems: memberRoster,
        memberId: memberId
      }
    }
    res.send(rosterTemplate(data))
  })
})

app.post('/card_status/', function (req, res) {
  debug('Updating card %s for member %s to status %s', req.body.cardName, req.body.memberId, req.body.status)

  roster.updateRoster(
    req.body.memberId,
    req.body.cardName,
    req.body.status,
    function (success) {
      if (success) {
        res.send('ok')
        res.end()
      } else {
        res.status(400).send('None shall pass')
        res.send('None shall pass')
      }
    }
  )
})

// technically this should be a POST
app.post('/league', function (req, res) {
  store.insertLeague(function (leagueId) {
    res.redirect('/league/' + leagueId)
  })
})

var leagueTemplate = pug.compileFile('pug/leagueSetup.pug')
app.get('/league/:leagueId', function (req, res) {
  var league = league.getLeagueById(req.params.leagueId, function (league) {
    res.send(leagueTemplate(league))
  })
})

// Console will print the message
console.log('Server running at http://127.0.0.1:%d/', PORT)
