import React from 'react';
import ProposalRegistrationStartedInteraction from './Interactions/ProposalsRegistrationStartedInteraction';
import RegisteringVotersInteraction from './Interactions/RegisteringVotersInteraction';
import ProposalsRegistrationEndedInteraction from './Interactions/ProposalsRegistrationEndedInteraction';
import VotesTalliedInteraction from './Interactions/VotesTalliedInteraction';
import VotingSessionEndedInteraction from './Interactions/VotingSessionEndedInteraction';
import VotingSessionStartedInteraction from './Interactions/VotingSessionStartedInteraction';

const workflowStatus = [
  'RegisteringVoters',
  'ProposalsRegistrationStarted',
  'ProposalsRegistrationEnded',
  'VotingSessionStarted',
  'VotingSessionEnded',
  'VotesTallied',
];

const description = [
  'Contract\'s owner can register voters.',
  'Registered voters can add proposals.',
  'Proposal adding session is now ended, contract\'s owner can move to the next state.',
  'Registered voters can now vote for their favorites proposals.',
  'The voting session has ended, contract\'s owner can move to the next state.',
  'Votes have been tallied !',
];

export default class Interaction extends React.Component {

  render() {
    const InteractionComponent = () => {
      switch (Number(this.props.workflowStatus)) {
        case 0:
          return <RegisteringVotersInteraction
            account={this.props.account}
            contract={this.props.contract}
            contractStatus={workflowStatus[this.props.workflowStatus]}
            description={description[this.props.workflowStatus]} />;
        case 1:
          return <ProposalRegistrationStartedInteraction
            account={this.props.account}
            contract={this.props.contract}
            contractStatus={workflowStatus[this.props.workflowStatus]}
            description={description[this.props.workflowStatus]} />;
        case 2:
          return <ProposalsRegistrationEndedInteraction
            account={this.props.account}
            contract={this.props.contract}
            contractStatus={workflowStatus[this.props.workflowStatus]}
            description={description[this.props.workflowStatus]} />;
        case 3:
          return <VotingSessionStartedInteraction
            account={this.props.account}
            contract={this.props.contract}
            contractStatus={workflowStatus[this.props.workflowStatus]}
            description={description[this.props.workflowStatus]} />;
        case 4:
          return <VotingSessionEndedInteraction
            account={this.props.account}
            contract={this.props.contract}
            contractStatus={workflowStatus[this.props.workflowStatus]}
            description={description[this.props.workflowStatus]} />;
        case 5:
          return <VotesTalliedInteraction
            account={this.props.account}
            contract={this.props.contract}
            contractStatus={workflowStatus[this.props.workflowStatus]}
            description={description[this.props.workflowStatus]} />;
        default:
          console.log('Workflow status: ' + this.props.workflowStatus);
          return <p>Unknown workflow status!</p>;
      }
    };

    return (
      <div style={{ border: '1px solid black' }}>
        <InteractionComponent />
      </div>
    );
  }
}
