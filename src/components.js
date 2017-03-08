import React, { Component } from 'react';
import style from './style.css';
import axios from 'axios';

const ONE_HUNDRED = 100;
const MINUMUM_VALUE = 0;

const isGreaterThanHundredPercent = (percentageValue) => percentageValue >= ONE_HUNDRED;

export class ProgressBarsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bars: [],
      numberRates: [],
      selectedBar: undefined
    }

    this.updateProgressBarValue = this.updateProgressBarValue.bind(this);
    this.selectedBarChanged = this.selectedBarChanged.bind(this);
  }

  selectedBarChanged(selectedBar) {
    this.setState({ selectedBar: selectedBar });
  }

  updateProgressBarValue(value) {
    value = Number(value);
    this.setState( (state) => ({
      bars: state.bars.map(bar => Number(bar))
      .map( (bar, index) => {
        const currentBarValue =  Number(state.selectedBar) === index ?
          bar + value : bar;
        return Math.max(MINUMUM_VALUE, currentBarValue);
      })
    }));
  }

  async componentWillMount() {
    const baseUrl = 'http://frontend-exercise.apps.staging.digital.gov.au';
    const response = await axios.get(`${baseUrl}/bars`);
    const defaultResponseValues = { bars: [], limit: ONE_HUNDRED, buttons: [] };
    const { bars, limit, buttons } = Object.assign(defaultResponseValues, response.data);

    this.setState({
      bars: bars.map(bar => Math.round((bar * ONE_HUNDRED)/limit)),
      numberRates: buttons,
      selectedBar: MINUMUM_VALUE
    });
  }

  render() {
    return (
      <div>
        <Title/>
        <ProgressBarList bars={this.state.bars}/>
        <BarSelector selectedBar={this.state.selectedBar} bars={this.state.bars} handleChange={this.selectedBarChanged}/>
        <ButtonList numberRates={this.state.numberRates} handleClick={this.updateProgressBarValue}/>
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

export class NumberRateButton extends Component {
  render() {
    return (
      <button value={this.props.value} onClick={this.props.handleClick}>{this.props.value}</button>
    )
  }
}
