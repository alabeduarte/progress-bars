import React, { Component } from 'react';
import style from './style.css';
import axios from 'axios';

export class ProgressBarsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bars: [],
      numberRates: [],
      selectedBar: undefined
    }

    this.increase = this.increase.bind(this);
    this.selectedBarChanged = this.selectedBarChanged.bind(this);
  }

  selectedBarChanged(selectedBar) {
    this.setState({ selectedBar: selectedBar });
  }

  increase(value) {
    this.setState( (state = {bars: []}) => ({
      bars: state.bars.map( (bar, index) => {
        return Number(state.selectedBar) === Number(index) ?
          Number(bar) + Number(value) : bar;
      }).map( (bar) => Number(bar) > 0 ? bar : 0)
    }));
  }

  async componentWillMount() {
    const baseUrl = 'http://frontend-exercise.apps.staging.digital.gov.au';
    const response = await axios.get(`${baseUrl}/bars`);
    const data = response.data;
    const limit = data.limit ? Number(data.limit) : 100;

    this.setState({
      bars: (data.bars || []).map( (bar) => {
        return Math.round((bar * 100)/limit);
      }),
      numberRates: data.buttons,
      selectedBar: data.bars ? 0 : undefined
    });
  }

  render() {
    return (
      <div>
        <Title/>
        <ProgressBarList bars={this.state.bars}/>
        <BarSelector selectedBar={this.state.selectedBar} bars={this.state.bars} handleChange={this.selectedBarChanged}/>
        <ButtonList numberRates={this.state.numberRates} handleClick={this.increase}/>
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
  get percentageValue() {
    const value = this.props.value;

    return (value && value >= 0) ? Number(value) : 0;
  }

  isGreaterThanHundredPercent() {
    return this.percentageValue >= 100;
  }

  get percentageWidth() {
    const width = this.isGreaterThanHundredPercent() ?
      100 : this.percentageValue;

    return `${width}%`;
  }

  render() {
    const classNames = this.isGreaterThanHundredPercent() ?
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

export class BarSelector extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.handleChange(event.target.value);
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

export class ButtonList extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.handleClick(event.target.value);
  }

  render() {
    return this.props.numberRates ?
      (
        <ul className={style.controls}>
          {this.props.numberRates.map( (numberRate) => {
            return numberRate > 0 ? `+${numberRate}` : numberRate.toString();
          }).map( (numberRate, index) => (
            <li key={index}>
              <NumberRateButton value={numberRate} handleClick={this.handleClick}/>
            </li>
          ))}
        </ul>
      ) : null
  }
}

export class NumberRateButton extends Component {
  render() {
    return (
      <button value={this.props.value} onClick={this.props.handleClick}>{this.props.value}</button>
    )
  }
}
