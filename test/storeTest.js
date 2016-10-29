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
      t.equal('', league.name) // league name is empty string by default
      t.end()
    })
  })
})

test('add player to league', t => {
  store.insertLeague(leagueId => {
    store.addPlayerToLeague('test_player', (leagueId, memberId) => {
      t.assert(memberId)
      store.loadPlayersForLeague()
      t.end()
    })
  })
})

test('load players for league', t => {
  t.end()
})

test.onFinish(() => {
  store.close(() => { fs.unlinkSync(dbFilePath) })
})
