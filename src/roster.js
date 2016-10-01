var mtgJson = require('./mtgjson')
var _ = require('lodash')
var store = require('./store')

var STATUS_CODE_NAMES = {
  0: "active",
  1: "bench",
  2: "dropped"
}

var loadCardsOwnedByPlayer = function(memberId, callback) {
  store.loadRosterByMemberId(memberId, function(card_statuses){
    var vms = _.map(card_statuses, function(card_status){
      return {
        name: card_status.card_name,
        status: STATUS_CODE_NAMES[card_status.status_code],
      }
    })
    callback(vms)
  })
}

var isLand = function(cardData) {
  return _.includes(cardData.types, 'Land')
}

var isPermanent = function(cardData) {
  return _.intersection(cardData.types, ['Land', 'Artifact', 'Enchantment', 'Creature', 'Planeswalker']).length > 0
}

var position = {
  land: "Land",
  permanent: "Permanent",
  nonPermanent: "Instant/Sorcery",
  bench: "Bench"
}

var sortOrder = {}
sortOrder[position.land] = 0
sortOrder[position.permanent] = 1
sortOrder[position.nonPermanent] = 2
sortOrder[position.bench] = 3

var constructRosterData = function(cardOwnership) {
  var rosterData = { name: cardOwnership.name }
  if (cardOwnership.status == 'bench') {
    rosterData.position = position.bench
  } else {
    var cardData = mtgJson.getCardByName(cardOwnership.name)
    if (isLand(cardData)) {
      rosterData.position = position.land
    } else if (isPermanent(cardData)) {
      rosterData.position = position.permanent
    } else {
      rosterData.position = position.nonPermanent
    }
  }
  return rosterData
}

var loadRoster = function(memberId, callback) {
  loadCardsOwnedByPlayer(memberId, function(ownedCards){
    var rosterCards = _.map(ownedCards, constructRosterData)
    var sortedCards = _.sortBy(rosterCards, card => sortOrder[card.position])
    callback(sortedCards)
  })
}

exports.loadRoster = loadRoster;
