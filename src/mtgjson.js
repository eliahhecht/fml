var _ = require('lodash')
var allCards = require('../data/AllCards-x.json')

var legalCards = []
var legalCardsByName = {}

for (cardName of Object.keys(allCards)) {
  if (allCards.hasOwnProperty(cardName)) {
    var card = allCards[cardName];
    if (_.find(card.legalities, x => x.legality == 'Legal' && x.format == 'Standard')) {
      console.log('found legal card')
      legalCards.push(card)
      legalCardsByName[cardName] = card
    } else {
      // console.log('card not legal: ' + cardName)
    }
  }
}

exports.legalCards = legalCards
exports.getCardByName = name => legalCardsByName[name]