import React, { Component } from 'react';

export class ProgressBarsContainer extends Component {
  render() {
    return (
      <div>
        <Title/>
        <ProgressBarList/>
        <BarSelector/>
        <Buttons/>
      </div>
    )
  }
}

export class Title extends Component {
  render() {
    return (<h1>Progress Bars</h1>)
  }
}

export class ProgressBarList extends Component {
  render() {
    return this.props.bars ?
      (
        <ul>
          {this.props.bars.map( (bar, index) => (
            <li key={index}>{bar}%</li>
          ))}
        </ul>
      ) : null
  }
}

export class Bar extends Component {
  render() {
    return null
  }
}

export class BarSelector extends Component {
  render() { return null }
}

export class Buttons extends Component {
  render() {
    return this.props.rateNumbers ?
      (
        <ul>
          {this.props.rateNumbers.map( (rateNumber) => {
            return rateNumber > 0 ? `+${rateNumber}` : rateNumber.toString();
          }).map( (rateNumber, index) => (
            <li key={index}><button>{rateNumber}</button></li>
          ))}
        </ul>
      ) : null
  }
}
