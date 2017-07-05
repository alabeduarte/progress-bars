import React, { Component } from 'react';
import axios from 'axios';

import ButtonList from './ButtonList';
import BarSelector from './BarSelector';
import Bar from './Bar';
import ProgressBarList from './ProgressBarList';

import { ONE_HUNDRED, MINUMUM_VALUE } from './ProgressBarConfig';

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
