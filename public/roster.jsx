var RosterEntry = React.createClass({

	isBench: function() {
		return this.props.card.position == 'Bench'
	},

	triggerMove: function() {
		var newStatus = isBench ? RosterStatusCode.Active : RosterStatusCode.Bench
		$.post(
			"/card_status",
			{
				cardName: this.props.card.name,
				status: newStatus,
				memberId: this.props.memberId
			}
		)
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
    <Roster rosterItems={window.bootstrapRosterData.rosterItems} memberId={window.bootstrapRosterData.memberId} />,
    document.getElementById('roster')
)