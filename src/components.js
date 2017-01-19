import React, { Component } from 'react';

export class ProgressBarsContainer extends Component {
  render() {
    return (
      <div>
        <Title/>
        <Bars/>
        <BarsSelector/>
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

export class Bars extends Component {
  render() {
    return this.props.progressBars ?
      (
        <ul>
          {this.props.progressBars.map( (progressBar, index) => (
            <li key={index}>{progressBar}%</li>
          ))}
        </ul>
      ) : null
  }
}

export class BarsSelector extends Component {
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
