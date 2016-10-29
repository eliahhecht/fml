var test = require('tape')
var fs = require('fs')
var tmp = require('tmp')
var _ = require('lodash')

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
  var userName = 'test@example.com'
  store.insertUser(userName, userId => {
    store.insertLeague(leagueId => {
      var userId = 1
      store.addPlayerToLeague(userId, leagueId, (memberId) => {
        t.assert(memberId)
        store.loadMembersForLeague(leagueId, playerIds => {
          t.ok(_(playerIds).includes(userId))
        })
        t.end()
      })
    })
  })
})

test('load players for league', t => {
  t.ok(true)
  t.end()
})

test.onFinish(() => {
  store.close(() => { fs.unlinkSync(dbFilePath) })
})
