var store = require('./store')
var _ = require('lodash')

/** Load the specified league, along with its players and their cards.
 * Callback will be invoked with the league object.
*/
function getLeagueById (leagueId, callback) {
  store.loadLeagueById(leagueId, function (league) {
    store.loadPlayersForLeague(leagueId, function (players) {
      store.loadCardsOwnedByPlayers(_(players).pluck('playerId'), function (cards) {
        league.players = players
        players.forEach(function (p) { p.cards = [] })
        var playerSet = _(players).keyBy('playerId')
        cards.forEach(function (card) {
          playerSet[card.playerId].cards.push(card)
        })
        callback(league)
      })
    })
  })
}

exports.getLeagueById = getLeagueById
