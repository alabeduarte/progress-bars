import React, { Component } from 'react';

export class ProgressBarsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bars: [],
      rateNumbers: []
    }

    this.http = this.props.http;
  }

  async componentWillMount() {
    const baseUrl = 'http://frontend-exercise.apps.staging.digital.gov.au';
    const response = await this.http.get(`${baseUrl}/bars`);
    const data = response.data

    this.setState({
      bars: data.bars,
      rateNumbers: data.buttons
    });
  }

  render() {
    return (
      <div>
        <Title/>
        <ProgressBarList bars={this.state.bars}/>
        <BarSelector bars={this.state.bars}/>
        <Buttons rateNumbers={this.state.rateNumbers}/>
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
            <li key={index}><Bar value={bar}/></li>
          ))}
        </ul>
      ) : null
  }
}

export class Bar extends Component {
  render() {
    return (this.props.value && this.props.value >= 0) ?
      (<label>{this.props.value}%</label>) : (<label>0%</label>)
  }
}

export class BarSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedBar: this.props.bars ? this.props.bars[0] : ''
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ selectedBar: event.target.value });
  }

  render() {
    return this.props.bars ?
      (
        <select value={this.state.selectedBar} onChange={this.handleChange}>
          {this.props.bars.map((bar, index) => (
            <option key={index} value={bar}>#progress{index + 1}</option>
          ))}
        </select>
      ) : null
  }
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
