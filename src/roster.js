var mtgJson = require('./mtgjson')
var _ = require('lodash')

var loadCardsOwnedByPlayer = function(memberId) {
  // mocked for now
  return [
    { name: "Shambling Vent", status: "active" },
    { name: "Smuggler's Copter", status: "active" },
    { name: "Chandra, Pyrogenius", status: "bench" },
    { name: "Bring to Light", status: "active" }
  ]
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

var loadRoster = function(memberId) {
  var ownedCards = loadCardsOwnedByPlayer(memberId)
  var rosterCards = _.map(ownedCards, constructRosterData)
  return _.sortBy(rosterCards, card => sortOrder[card.position])
}

exports.loadRoster = loadRoster;