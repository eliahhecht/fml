"use strict"

var boostrapData = window.bootstrapRosterData
var Store = function() {
	var self = this

	this.cards = bootstrapRosterData.rosterItems
	this.memberId = boostrapData.memberId

	var enrich = function(cards) {
		return _(cards)
			.forEach(function(card) {
				card.position = self.findPosition(card)
			})
	}

	this.getRosterItems = function() {
		return enrich(this.cards)
	}

	// currently synced manually with src/constant.js
	this.cardStatus =  {
		Active: 0,
		Bench: 1
	}

	this.position =  {
		Land: "Land",
		Permanent: "Permanent",
		InstantOrSorcery: "Instant/Sorcery",
		Bench: "Bench"
	}

	this.expectedCounts = [
		{
			position: this.position.Land,
			expectedCount: 1
		},
		{
			position: this.position.Permanent,
			expectedCount: 3
		},
		{
			position: this.position.InstantOrSorcery,
			expectedCount: 2
		}
	]


	this.findPosition = function(card) {
		var self = this
		if (card.status == 1) {
			return self.position.Bench
		} else if (_.includes(card.types, "Land")) {
			return self.position.Land
		} else if (_.intersection(card.types, ["Instant", "Sorcery"]).length) {
			return self.position.InstantOrSorcery
		} else if (card.types) {
			return self.position.Permanent
		} else {
			return "Unknown"
		}
	}

	this.submitMove = function(card) {
		var self = this
		var activeStatus = 0
		var benchStatus = 1
		card.status = card.position == 'Bench' ? activeStatus : benchStatus;

		$.post(
			"/card_status",
			{
				cardName: card.name,
				status: card.status,
				memberId: self.memberId
			}
		).then(function() {
			card.position = self.findPosition(card)
			self.trigger('updateRoster')
		})
	}

	this.couldBecomeActive = function(card) {
		var self = this
		candidateCardPosition = self.findPosition(card)
		totalSlotsInPosition = _(self.expectedCount)
			.find(function(pos) {pos.position == candidateCardPosition}).expectedCount
		activeCardsInPosition = _(self.cards)
			.filter(function(c) {c.position == candidateCardPosition})
		return activeCardsInPosition < totalSlotsInPosition
	}

}

var store = new Store()

MicroEvent.mixin(store)

var RosterEntry = React.createClass({

	isBench: function() {
		return this.props.card.position == 'Bench'
	},

	triggerMove: function() {
		store.submitMove(this.props.card)
	},

	isEmpty: function() {
		return this.props.card.name == ""
	},

	canMove: function() {
		var self = this
		if (self.isEmpty) {
			return false
		} else if (!self.isBench) {
			// can always move cards down to bench
			return true
		} else {
			return store.couldBecomeActive(this.props.card)
		}

	},

	render: function() {

		var moveButton;
		if (this.isEmpty()) {
			moveButton = <td />
		} else {
			var arrowDirection = this.isBench() ? 'up' : 'down'
			var spanClass = "glyphicon glyphicon-arrow-" + arrowDirection
			moveButton = <td> 
				<button onClick={this.triggerMove} className="btn btn-default btn-xs"> 
					<span className={spanClass}></span> 
				</button> 
			</td>
		}

		return(
			<tr>
				<td>
					{moveButton}
				</td>
				<td>
					{this.props.card.position}
				</td>
				<td>
					{this.props.card.name}
				</td>
			</tr>
		)
	}
});

var Roster = React.createClass({

	makeRosterItem: function(card) {
		var self = this
		return (<RosterEntry card={card} memberId={self.props.memberId} />)
	},

	render: function() {
		var self = this;

		var rosterItemNodes = []

		_(store.expectedCounts).forEach(function (count) {
			var countRemaining = count.expectedCount
			_(self.props.rosterItems).forEach(function (card) {
				if (card.position == count.position) {
					countRemaining--
				  rosterItemNodes.push(self.makeRosterItem(card))
				}
			})
			for (; countRemaining > 0; countRemaining--) {
				var emptySlot = {name: "", position: count.position}
				rosterItemNodes.push(<RosterEntry card={emptySlot} />)
			}
		})

		_(self.props.rosterItems)
			.filter(function(card) { return card.position == store.position.Bench })
			.forEach(function(card) { rosterItemNodes.push(self.makeRosterItem(card)) })

		return(
			<table className="table">
				<thead>
					<tr>
						<th></th>
						<th>Position</th>
						<th>Name</th>
					</tr>
				</thead>
				<tbody>
					{ rosterItemNodes }
				</tbody>
			</table>
		)
	}
})

var renderRoster = function() {
	ReactDOM.render(
	  <Roster rosterItems={store.getRosterItems()} memberId={store.memberId} />,
	  document.getElementById('roster')
	)
}

renderRoster()
store.bind('updateRoster', renderRoster)