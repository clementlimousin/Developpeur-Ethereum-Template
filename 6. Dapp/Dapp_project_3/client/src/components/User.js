import React from 'react';

export default class User extends React.Component {
  render() {
    return (
      <h2>Hello, you are {this.props.addr} !</h2>
    );
  }
}
