import React, { Component } from "react"

export default class Voters extends Component {
  constructor(props) {
    super(props);
    this.state = { voters: [] };
    this.asyncVoters();
    this.asyncVotes();
  }

  asyncVotes = async () => {

    this.props.contract.getPastEvents('Voted', { fromBlock: 0, toBlock: 'latest' })
      .then((results) => {
        //let voters = [];
        results.forEach(async (result) => {
          console.log(result);
          // let voterInfo = await this.props.contract.methods.getVoter(result.address).call({ from: this.props.account });
          // voters.push({ address: result.returnValues.voterAddress, info: voterInfo });
          // console.log(voterInfo);
          // this.setState({ voters: voters });
        });

        // this.setState({ voters: voters });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  asyncVoters = async () => {
    this.props.contract.getPastEvents('VoterRegistered', { fromBlock: 0, toBlock: 'latest' })
      .then((results) => {
        let votersArray = [];
        results.forEach(async (result) => {
          let voterInfo = await this.props.contract.methods.getVoter(result.returnValues.voterAddress).call({ from: this.props.account });
          votersArray.push({ address: result.returnValues.voterAddress, info: voterInfo });
          this.setState({ voters: votersArray });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <h4>Registered voters</h4>
        <table style={{ border: '1px solid black', marginLeft: 'auto', marginRight: 'auto' }}>
          <thead>
            <tr>
              <th>Address</th>
              <th>Has voted</th>
              <th>Voted for proposal</th>
            </tr>
          </thead>
          <tbody>
            {this.state.voters.map(voterDetails =>
              <tr key={voterDetails.address}>
                <td>{voterDetails.address}</td>
                <td>{voterDetails.info.hasVoted ? 'Yes' : 'No'}</td>
                <td>{voterDetails.info.hasVoted ? '#' + voterDetails.info.votedProposalId : '-'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div >
    )
  }
}