var mtgJson = require('./mtgjson')
var _ = require('lodash')
var store = require('./store')
var constant = require('./../public/constant')

var loadCardsOwnedByPlayer = function(memberId, callback) {
  store.loadRosterByMemberId(memberId, function(cardStatuses){
    var vms = _.map(cardStatuses, function(cardStatus){
      return {
        name: cardStatus.card_name,
        status: cardStatus.status_code,
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
  if (cardOwnership.status == constant.StatusCode.Bench) {
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

var updateRoster = function(memberId, cardName, newStatusCode, callback) {
  loadCardsOwnedByPlayer(memberId, function(ownedCards){
    var doesOwnCard = _.filter(ownedCards, card => card.name == cardName).length > 0
    if (!doesOwnCard){
      callback(false)
    }

    var validStatus = false
    for (statusName of Object.keys(constant.StatusCode)) {
      if (constant.StatusCode.hasOwnProperty(statusName)) {
        var statusCode = constant.StatusCode[statusName]
        validStatus |= statusCode == newStatusCode
      }
    }
    if (!validStatus){
      callback(false)
    }

    store.insertCardStatus(memberId, cardName, newStatusCode, function(){
      callback({
        name: cardName,
        status: newStatusCode
      })
    })
  })
}

exports.loadRoster = loadRoster;
