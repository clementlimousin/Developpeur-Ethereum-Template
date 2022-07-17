import React, { Component } from "react"

export default class ProposalRegistrationStartedInteraction extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: null, interactionResult: "-" };
  }

  handleOnChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const component = this;

    await this.props.contract.methods.addProposal(this.state.inputValue).send({ from: this.props.account })
      .once('transactionHash', function (hash) {
        console.log('Transaction sent with hash: ' + hash);
      })
      .on('error', function (error) {
        component.setState({ interactionResult: error.message });
      })
      .then(function (receipt) {
        let addedProposalId = receipt.events.ProposalRegistered.returnValues.proposalId;
        component.setState({ interactionResult: "Proposal #" + addedProposalId + " has been added!" });
        setTimeout(() => window.location.reload(), 2000);
      });
  }

  handleSubmitWorkflowChange = async (e) => {
    e.preventDefault();
    const component = this;

    await this.props.contract.methods.endProposalsRegistering().send({ from: this.props.account })
      .once('transactionHash', function (hash) {
        console.log('Transaction sent with hash: ' + hash);
      })
      .on('error', function (error) {
        component.setState({ endRegisteringResult: error.message });
      })
      .then(function (receipt) {
        component.setState({ endRegisteringResult: "Voting contract is now in proposal registering ended state" });
        setTimeout(() => window.location.reload(), 2000);
      });
  }

  render() {
    return (
      <div>
        <h4>Status:  {this.props.contractStatus}</h4>
        <p>{this.props.description}</p>
        <form onSubmit={this.handleSubmit} className="form">
          <label htmlFor="proposalDesc">Proposal description: </label>
          <input id="proposalDesc" type="text" name='inputValue' onChange={this.handleOnChange} className="input" />
          <input type="submit" value="Add proposal" className="button" />
        </form>
        <p>Interaction result: {this.state.interactionResult}</p>
        <form onSubmit={this.handleSubmitWorkflowChange} className="form">
          <input type="submit" value="End proposal registering" className="button" />
        </form>
        <p>End proposal registering interaction result: {this.state.endRegisteringResult}</p>
      </div>
    )
  }
}