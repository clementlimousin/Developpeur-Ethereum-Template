import React, { Component } from "react"

export default class VotesTalliedInteraction extends Component {
  constructor(props) {
    super(props);
    this.state = { winningProposalId: null };

    this.loadWinningProposalId();
  }

  loadWinningProposalId = async () => {
    this.props.contract.methods.winningProposalID().call({ from: this.props.account })
      .then((result) => {
        this.setState({winningProposalId: result});
      })
      .catch((err) => {
        console.log(err);
      })
  }

  render() {
    return (
      <div>
        <h4>Status:  {this.props.contractStatus}</h4>
        <p>{this.props.description}</p>
        <p>The winning proposal is {this.state.winningProposalId == null ? '...' : '#' + this.state.winningProposalId + ' !'}</p>
      </div>
    );
  }

}