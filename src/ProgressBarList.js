import React, { Component } from 'react';

import Bar from './Bar';

export default class ProgressBarList extends Component {

  shouldComponentUpdate(nextProps) {
    return this.props.bars.toString() !== nextProps.bars.toString();
  }

  render() {
    return this.props.bars ?
      (
        <ul>
          {this.props.bars.map( (bar, index) => (
            <li key={index}><Bar value={bar}/></li>
          ))}
        </ul>
      ) : null
  }
}
