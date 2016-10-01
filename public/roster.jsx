var RosterEntry = React.createClass({

	render: function() {

		var moveButton;
		if (this.props.card.isEmpty) {
			moveButton = <td />
		} else {
			var arrowDirection = (this.props.card.position == 'Bench' ? 'up' : 'down')
			var spanClass = "glyphicon glyphicon-arrow-" + arrowDirection
			moveButton = <td><button className="btn btn-default btn-xs"><span className={spanClass}></span></button></td>
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
		var rosterItemNodes = this.props.rosterItems.map(function(item) {
			return(
				<RosterEntry card={item} />
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
    <Roster rosterItems={window.bootstrapRosterData} />,
    document.getElementById('roster')
);