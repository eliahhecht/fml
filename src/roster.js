var mtgJson = require('./mtgjson')

var loadCardsOwnedByPlayer = function(memberId) {
  // mocked for now
  return [
    { name: "Shambling Vent", status: "active" },
    { name: "Smuggler's Copter", status: "active" },
    { name: "Chandra, Pyrogenius", status: "bench" }
  ]
}

var constructRosterData = function(cardOwnership) {
  var rosterData = { name: cardOwnership.name }
  if (cardOwnership.status == 'bench') {
    rosterData.position = 'bench'
  } else {
    var cardData = mtgJson.getCardByName(cardOwnership.name)
    
  }

}

var loadRoster = function(memberId) {
  var ownedCards = loadCardsOwnedByPlayer(memberId)
  var roster = {
    active: [],
    bench: []
  }
  for (var card of ownedCards) {
    var cardData = mtgJson.getCardByName(card.name)
    if (card.status == 'active') {
      roster.active.push(cardData)
    } else {
      roster.bench.push(cardData)
    }
  }
  return roster
}

exports.loadRoster = loadRoster;