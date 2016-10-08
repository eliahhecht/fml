var boostrapData = window.bootstrapRosterData
var Store = {

	rawRosterItems: bootstrapRosterData.rosterItems,
	memberId: boostrapData.memberId,

	getRosterItems: function() {
		return this.enrich(this.rawRosterItems)
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
		return _.chain(cards)
			.forEach(function(card) {
				card.position = self.findPosition(card)
			})
			.sortBy(function(card) {
				switch(card.position) {
					case self.position.Land:
						return 0
					case self.position.Permanent:
						return 1
					case self.position.InstantOrSorcery:
						return 2
					case self.position.Bench:
						return 3
				}
			})
			.value()
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
		var newStatus = card.position == 'Bench' ? activeStatus : benchStatus;
		$.post(
			"/card_status",
			{
				cardName: card.name,
				status: newStatus,
				memberId: self.memberId
			}
		).then(function() {
			card.position = findPosition(card)
			self.trigger('updateRoster', self.Data)
		})
	}

}

var RosterEntry = React.createClass({

	isBench: function() {
		return this.props.card.position == 'Bench'
	},

	triggerMove: function() {
		//ehtodo push this up to the client somehow
	},

	render: function() {

		var moveButton;
		if (this.props.card.isEmpty) {
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

	render: function() {
		var self = this;
		var rosterItemNodes = this.props.rosterItems.map(function(item) {
			return(
				<RosterEntry card={item} memberId={self.props.memberId} />
			)
		});

		console.log(rosterItemNodes)

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

ReactDOM.render(
  <Roster rosterItems={Store.getRosterItems()} memberId={Store.memberId} />,
  document.getElementById('roster')
)