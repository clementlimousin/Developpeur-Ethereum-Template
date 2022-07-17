import React, { Component } from "react"

export default class VotingSessionEndedInteraction extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmitWorkflowChange = async (e) => {
    e.preventDefault();
    const component = this;

    await this.props.contract.methods.tallyVotes().send({ from: this.props.account })
      .once('transactionHash', function (hash) {
        console.log('Transaction sent with hash: ' + hash);
      })
      .on('error', function (error) {
        component.setState({ tallyVotesResult: error.message });
      })
      .then(function (receipt) {
        component.setState({ tallyVotesResult: "Votes are tallied !" });
        setTimeout(() => window.location.reload(), 2000);
      });
  }

  render() {
    return (
      <div>
        <h4>Status:  {this.props.contractStatus}</h4>
        <p>{this.props.description}</p>

        <form onSubmit={this.handleSubmitWorkflowChange} className="form">
          <input type="submit" value="Tally votes !" className="button" />
        </form>
        <p>Tally votes interaction result: {this.state.tallyVotesResult}</p>
      </div>
    )
  }

}