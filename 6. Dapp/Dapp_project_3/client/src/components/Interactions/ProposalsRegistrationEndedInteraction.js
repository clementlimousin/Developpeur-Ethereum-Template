import React, { Component } from "react"

export default class ProposalsRegistrationEndedInteraction extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmitWorkflowChange = async (e) => {
    e.preventDefault();
    const component = this;

    await this.props.contract.methods.startVotingSession().send({ from: this.props.account })
      .once('transactionHash', function (hash) {
        console.log('Transaction sent with hash: ' + hash);
      })
      .on('error', function (error) {
        component.setState({ startVotingResult: error.message });
      })
      .then(function (receipt) {
        component.setState({ startVotingResult: "Voting contract is now in voting session started state" });
        setTimeout(() => window.location.reload(), 2000);
      });
  }

  render() {
    return (
      <div>
        <h4>Status:  {this.props.contractStatus}</h4>
        <p>{this.props.description}</p>

        <form onSubmit={this.handleSubmitWorkflowChange} className="form">
          <input type="submit" value="Start voting session" className="button" />
        </form>
        <p>Start voting session interaction result: {this.state.startVotingResult}</p>
      </div>
    )
  }

}