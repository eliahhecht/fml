var test = require('tape')
var tmp = require('tmp')
var proxyquire = require('proxyquire')
var fs = require('fs')

// ehtodo DRY this temp-db shenanigans
var dbFilePath = tmp.tmpNameSync()
var store = require('../src/store')(dbFilePath)

var league = proxyquire('../src/league', {'./store': store})

test('get league works', function (t) {
  // var leagueGet = league.getLeagueById()
  t.end()
})

test.onFinish(() => {
  store.close(() => { fs.unlinkSync(dbFilePath) })
})
