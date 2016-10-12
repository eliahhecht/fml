var boostrapData = window.bootstrapRosterData
var Store = {

	cards: bootstrapRosterData.rosterItems,
	memberId: boostrapData.memberId,

	getRosterItems: function() {
		return this.enrich(this.cards)
	},

	// currently synced manually with src/constant.js
	cardStatus: {
		Active: 0,
		Bench: 1
	},

	position: {
		Land: "Land",
		Permanent: "Permanent",
		InstantOrSorcery: "Instant/Sorcery",
		Bench: "Bench"
	},

	enrich: function(cards) {
		var self = this
		return _(cards)
			.forEach(function(card) {
				card.position = self.findPosition(card)
			})
	},

	findPosition: function(card) {
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
	},

	submitMove: function(card) {
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

}
MicroEvent.mixin(Store)

var RosterEntry = React.createClass({

	isBench: function() {
		return this.props.card.position == 'Bench'
	},

	triggerMove: function() {
		Store.submitMove(this.props.card)
	},

	isEmpty: function() {
		return this.props.card.name == ""
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
		var expectedCounts = [
			{
				position: Store.position.Land,
				expectedCount: 1
			},
			{
				position: Store.position.Permanent,
				expectedCount: 3
			},
			{
				position: Store.position.InstantOrSorcery,
				expectedCount: 2
			}
		]

		var rosterItemNodes = []

		_(expectedCounts).forEach(function (count) {
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
			.filter(function(card) { return card.position == Store.position.Bench })
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
	  <Roster rosterItems={Store.getRosterItems()} memberId={Store.memberId} />,
	  document.getElementById('roster')
	)
}

renderRoster()
Store.bind('updateRoster', renderRoster)