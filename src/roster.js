var _ = require('lodash')
var debug = require('debug')('fml:roster')

var mtgjson = require('./mtgjson')
var store = require('./store')()
var constant = require('./constant')

var loadCardsOwnedByPlayer = function (memberId, callback) {
  store.loadRosterByMemberId(memberId, function (cardStatuses) {
    debug('loading cards owned by %s', memberId)
    var vms = _.map(cardStatuses, function (cardStatus) {
      var cardData = mtgjson.getCardByName(cardStatus.card_name)
      return {
        name: cardStatus.card_name,
        status: cardStatus.status_code,
        types: cardData.types
      }
    })
    debug('cards loaded: %j', vms)
    callback(vms)
  })
}

var updateRoster = function (memberId, cardName, newStatusCode, callback) {
  loadCardsOwnedByPlayer(memberId, function (ownedCards) {
    var doesOwnCard = _.filter(ownedCards, card => card.name === cardName).length > 0
    if (!doesOwnCard) {
      debug('update denied, player does not own card. player owns %j', ownedCards)
      callback(false)
    }

    if (!constant.RosterStatusCode.isValid(newStatusCode)) {
      debug('update denied, %s is not a valid status code', newStatusCode)
      callback(false)
    }

    store.insertCardStatus(memberId, cardName, newStatusCode, function () {
      callback({
        name: cardName,
        status: newStatusCode
      })
    })
  })
}

exports.loadCardsOwnedByPlayer = loadCardsOwnedByPlayer
exports.updateRoster = updateRoster
