import React, { Component } from 'react';
import axios from 'axios';

import style from './style.css';
import ButtonList from './ButtonList';
import BarSelector from './BarSelector';

const ONE_HUNDRED = 100;
const MINUMUM_VALUE = 0;

const isGreaterThanHundredPercent = (percentageValue) => percentageValue >= ONE_HUNDRED;

export class ProgressBarsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bars: [],
      numberRates: [],
      selectedBar: 0
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

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.bars.toString() !== nextState.bars.toString();
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

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (<h1>Progress Bars</h1>)
  }
}

export class ProgressBarList extends Component {

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
