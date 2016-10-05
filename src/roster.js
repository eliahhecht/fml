var mtgJson = require('./mtgjson')
var _ = require('lodash')
var store = require('./store')
var constant = require('./constant')

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
  if (cardOwnership.status == constant.RosterStatusCode.Bench) {
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

const ALLOWED_LANDS = 1
const ALLOWED_PERMANENTS = 3
const ALLOWED_NONPERMANENTS = 2

var addEmptyForPosition = function(position, expectedCount, cards) {
  var makeEmptyEntry = position => { return {position: position, name: "", isEmpty: true} }
  var numberPresent = _.filter(cards, c => c.position == position).length;
  if (numberPresent < expectedCount) {
    var numberOfEmptySlotsToAdd = expectedCount - numberPresent;
    for (var i = 0; i < numberOfEmptySlotsToAdd; i++) {
      cards.push(makeEmptyEntry(position));
    }
  }
}

var addEmptySlots = function(cards) {
  addEmptyForPosition(position.land, ALLOWED_LANDS, cards)
  addEmptyForPosition(position.permanent, ALLOWED_PERMANENTS, cards)
  addEmptyForPosition(position.nonPermanent, ALLOWED_NONPERMANENTS, cards)
}

var loadRoster = function(memberId, callback) {
  loadCardsOwnedByPlayer(memberId, function(ownedCards){
    var rosterCards = _.map(ownedCards, constructRosterData)
    addEmptySlots(rosterCards)
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
    Object.values(constants.StatusCode).forEach(function (statusCode){
        validStatus |= statusCode == newStatusCode
    })
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
