import React, { Component } from 'react';

import style from './style.css';
import NumberRateButton from './NumberRateButton';
import { MINUMUM_VALUE } from './ProgressBarConfig';

export default class ButtonList extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.handleClick(event.target.value);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.numberRates.toString() !== nextProps.numberRates.toString();
  }

  render() {
    return this.props.numberRates ?
      (
        <ul className={style.controls}>
          {this.props.numberRates.map( (numberRate) => {
            return numberRate > MINUMUM_VALUE ? `+${numberRate}` : numberRate.toString();
          }).map( (numberRate, index) => (
            <li key={index}>
              <NumberRateButton value={numberRate} handleClick={this.handleClick}/>
            </li>
          ))}
        </ul>
      ) : null
  }
}
