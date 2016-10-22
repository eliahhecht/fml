var _ = require('lodash')
var allCards = require('../data/AllCards-x.json')

var legalCards = []
var legalCardsByName = {}

var legalSets = ['BFZ', 'OGW', 'SOI', 'EMN', 'KLD']

for (var cardName of Object.keys(allCards)) {
  if (allCards.hasOwnProperty(cardName)) {
    var card = allCards[cardName]
    if (_.intersection(card.printings, legalSets).length > 0) {
      legalCards.push(card)
      legalCardsByName[cardName] = card
    }
  }
}

exports.legalCards = legalCards
exports.getCardByName = name => legalCardsByName[name]
