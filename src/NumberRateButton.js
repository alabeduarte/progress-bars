import React, { Component } from 'react';

export default class NumberRateButton extends Component {

  shouldComponentUpdate(nextProps) {
    return this.props.value !== nextProps.value;
  }

  render() {
    return (
      <button value={this.props.value} onClick={this.props.handleClick}>{this.props.value}</button>
    )
  }
}
