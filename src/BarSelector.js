import React, { Component } from 'react';

export default class BarSelector extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.handleChange(event.target.value);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.selectedBar !== nextProps.selectedBar ||
          this.props.bars.toString() !== nextProps.bars.toString();
  }

  render() {
    return this.props.bars ?
      (
        <select value={this.props.selectedBar} onChange={this.handleChange}>
          {this.props.bars.map((bar, index) => (
            <option key={index} value={index}>#progress{index + 1}</option>
          ))}
        </select>
      ) : null
  }
}
