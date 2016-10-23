var test = require('tape')
var fs = require('fs')
var tmp = require('tmp')

var dbFilePath = tmp.tmpNameSync()
var store = require('../src/store')(dbFilePath)

test('insert league works', t => {
  store.insertLeague(function (leagueId) {
    t.assert(leagueId)
  })
  t.end()
})

test('load league works', t => {
  store.insertLeague(id => {
    var leagueId = id
    store.loadLeagueById(leagueId, (league) => {
      t.equal(leagueId, league.id)
      t.end()
    })
  })
})

test.onFinish(() => {
  store.close(() => { fs.unlinkSync(dbFilePath) })
})
