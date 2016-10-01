var mtgJson = require('./mtgjson')
var _ = require('lodash')

var loadCardsOwnedByPlayer = function(memberId) {
  // mocked for now
  return [
    { name: "Shambling Vent", status: "active" },
    { name: "Smuggler's Copter", status: "active" },
    { name: "Chandra, Pyrogenius", status: "bench" }
  ]
}

var isLand = function(cardData) {
  return _.includes(cardData.types, 'Land')
}

var isPermanent = function(cardData) {
  return _.intersection(cardData.types, ['Land', 'Artifact', 'Enchantment', 'Creature', 'Planeswalker']).length > 0
}

var constructRosterData = function(cardOwnership) {
  var rosterData = { name: cardOwnership.name }
  if (cardOwnership.status == 'bench') {
    rosterData.position = 'Bench'
  } else {
    var cardData = mtgJson.getCardByName(cardOwnership.name)
    if (isLand(cardData)) {
      rosterData.position = 'Land'
    } else if (isPermanent(cardData)) {
      rosterData.position = 'Non-Land Permanent'
    } else {
      rosterData.position = 'Non-Permanent'
    }
  }
  return rosterData
}

var loadRoster = function(memberId) {
  var ownedCards = loadCardsOwnedByPlayer(memberId)
  return _.map(ownedCards, constructRosterData)
}

exports.loadRoster = loadRoster;