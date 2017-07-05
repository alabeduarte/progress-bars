import React, { Component } from 'react';

import style from './style';
import { ONE_HUNDRED, MINUMUM_VALUE } from './ProgressBarConfig';

const isGreaterThanHundredPercent = (percentageValue) => {
  return percentageValue >= ONE_HUNDRED
};

export default class Bar extends Component {
  get percentageValue() {
    return Math.max(MINUMUM_VALUE, this.props.value || MINUMUM_VALUE);
  }

  get percentageWidth() {
    const width = isGreaterThanHundredPercent(this.percentageValue) ?
      ONE_HUNDRED : this.percentageValue;

    return `${width}%`;
  }

  render() {
    const classNames = isGreaterThanHundredPercent(this.percentageValue) ?
      [style.progress, style.beyondLimit] : [style.progress];

    return (
      <div className={style.bar}>
        <div className={classNames.join(' ')} style={{width: this.percentageWidth}}></div>
        <div className={style.progressBarLabel}>
          {this.percentageValue}%
        </div>
      </div>
    )
  }
}
