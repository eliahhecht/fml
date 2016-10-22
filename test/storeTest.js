var test = require('tape')
var fs = require('fs')

var dbFilePath = 'unitTests.db'
var store = require('../src/store')(dbFilePath)

test('insert league works', t => {
  store.insertLeague(function (leagueId) {
    t.assert(leagueId)
  })
  t.end()
})

test.onFinish(() => {
  store.close(() => { fs.unlinkSync(dbFilePath) })
})
