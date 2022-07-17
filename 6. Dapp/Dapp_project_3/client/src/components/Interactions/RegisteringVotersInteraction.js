import React, { Component } from "react"
import Web3 from 'web3';

export default class RegisteringVotersInteraction extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: null, addVoterResult: "-", startRegisteringResult: "-" };
  }

  handleOnChangeVoterInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmitVoter = async (e) => {
    e.preventDefault();
    const component = this;

    await this.props.contract.methods.addVoter(Web3.utils.toChecksumAddress(this.state.inputValue)).send({ from: this.props.account })
      .once('transactionHash', function (hash) {
        console.log('Transaction sent with hash: ' + hash);
      })
      .on('error', function (error) {
        component.setState({ addVoterResult: error.message });
      })
      .then(function (receipt) {
        let addedVoterAddress = receipt.events.VoterRegistered.returnValues.voterAddress;
        component.setState({ addVoterResult: addedVoterAddress + " has been added as a voter!" });
        setTimeout(() => window.location.reload(), 2000);
      });

  }

  handleSubmitWorkflowChange = async (e) => {
    e.preventDefault();
    const component = this;

    await this.props.contract.methods.startProposalsRegistering().send({ from: this.props.account })
      .once('transactionHash', function (hash) {
        console.log('Transaction sent with hash: ' + hash);
      })
      .on('error', function (error) {
        component.setState({ startRegisteringResult: error.message });
      })
      .then(function (receipt) {
        component.setState({ startRegisteringResult: "Voting contract is now in proposal registering started state" });
        setTimeout(() => window.location.reload(), 2000);
      });
  }

  render() {

    return (
      <div>
        <h4>Status: {this.props.contractStatus}</h4>
        <p>{this.props.description}</p>
        <form onSubmit={this.handleSubmitVoter} className="form">
          <label htmlFor="voterAddress">Voter address: </label>
          <input id="voterAddress" type="text" name='inputValue' onChange={this.handleOnChangeVoterInput} pattern="^0x[a-fA-F0-9]{40}$" className="input" />
          <input type="submit" value="Add voter" className="button" />
        </form>
        <p>Add voter interaction result: {this.state.addVoterResult}</p>
        <form onSubmit={this.handleSubmitWorkflowChange} className="form">
          <input type="submit" value="Start proposal registering" className="button" />
        </form>
        <p>Start proposal registering interaction result: {this.state.startRegisteringResult}</p>
      </div>
    )
  }
}