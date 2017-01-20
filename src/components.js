import React, { Component } from 'react';

export class ProgressBarsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bars: [],
      numberRates: []
    }

    this.http = this.props.http;
    this.increase = this.increase.bind(this);
  }

  increase(barIndex, numberRateIndex) {
    const bars = this.state.bars;
    const numberRate = this.state.numberRates[numberRateIndex];

    this.setState({
      bars: bars.map( (bar, index) => {
        return index === barIndex ? bar + numberRate : bar;
      })
    });
  }

  async componentWillMount() {
    const baseUrl = 'http://frontend-exercise.apps.staging.digital.gov.au';
    const response = await this.http.get(`${baseUrl}/bars`);
    const data = response.data

    this.setState({
      bars: data.bars,
      numberRates: data.buttons
    });
  }

  render() {
    return (
      <div>
        <Title/>
        <ProgressBarList bars={this.state.bars}/>
        <BarSelector bars={this.state.bars}/>
        <ButtonList numberRates={this.state.numberRates}/>
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

export class ButtonList extends Component {
  render() {
    return this.props.numberRates ?
      (
        <ul>
          {this.props.numberRates.map( (numberRate) => {
            return numberRate > 0 ? `+${numberRate}` : numberRate.toString();
          }).map( (numberRate, index) => (
            <li key={index}><NumberRateButton value={numberRate}></NumberRateButton></li>
          ))}
        </ul>
      ) : null
  }
}

export class NumberRateButton extends Component {
  render() {
    return (
      <button value={this.props.value}>{this.props.value}</button>
    )
  }
}
