import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import axios from 'axios';

import NumberRateButton from '../src/NumberRateButton';
import ButtonList from '../src/ButtonList';
import BarSelector from '../src/BarSelector';
import Bar from '../src/Bar';
import ProgressBarList from '../src/ProgressBarList';
import { ProgressBarsContainer, Title } from '../src/components';

describe('ProgressBarsContainer', () => {

  sinon.stub(axios, 'get');

  it('renders components', () => {
    axios.get.returns(Promise.resolve({ data: {} }));

    const wrapper = shallow(<ProgressBarsContainer/>);

    expect(wrapper.containsAllMatchingElements([
      <Title/>,
      <ProgressBarList/>,
      <BarSelector/>,
      <ButtonList/>
    ])).to.equal(true);
  });

  it('fetches data endpoint', async () => {
    const bars = [10, 30, 90];
    const numberRates = [10, 20];
    const limit = 230;
    axios.get.returns(Promise.resolve({
      data: {
        bars: bars,
        buttons: numberRates,
        limit: limit
      }
    }));

    const wrapper = await shallow(<ProgressBarsContainer/>);
    const postCalculatedBarsBasedOnLimit = [4, 13, 39];
    const selectedBarChanged = wrapper.instance().selectedBarChanged;

    expect(wrapper.containsAllMatchingElements([
      <ProgressBarList bars={postCalculatedBarsBasedOnLimit}/>,
      <BarSelector selectedBar={0} bars={postCalculatedBarsBasedOnLimit} handleChange={selectedBarChanged}/>,
      <ButtonList numberRates={numberRates}/>
    ])).to.equal(true);
  });

  it('recalculates bar values according to the limit', async () => {
    const bars = [10, 30, 90];
    const numberRates = [10, 20];
    const limit = 230;

    axios.get.returns(Promise.resolve({
      data: {
        bars: bars,
        buttons: numberRates,
        limit: limit
      }
    }));

    const wrapper = await shallow(<ProgressBarsContainer/>);

    expect(wrapper.state('bars')).to.eql([4, 13, 39])
  });

  describe('Increasing/Decreasing progress bars', () => {
    const bars = [1, 10, 5];
    const numberRates = [-3, 2];

    before(() => {
      axios.get.returns(Promise.resolve({
        data: {
          bars: bars,
          buttons: numberRates
        }
      }));
    });

    it('increases bar percentage by rate number', async () => {
      const wrapper = await shallow(<ProgressBarsContainer/>);

      expect(wrapper.state('bars')).to.eql([1, 10, 5]);

      wrapper.instance().updateProgressBarValue(2) ;

      expect(wrapper.state('bars')).to.eql([3, 10, 5]);
      expect(wrapper.state('numberRates')).to.eql([-3, 2]);
    });

    it('decreases bar percentage by rate number', async () => {
      const wrapper = await shallow(<ProgressBarsContainer/>);
      wrapper.setState({ selectedBar: 1 });

      expect(wrapper.state('bars')).to.eql([1, 10, 5]);

      wrapper.instance().updateProgressBarValue(-3);

      expect(wrapper.state('bars')).to.eql([1, 7, 5]);
      expect(wrapper.state('numberRates')).to.eql([-3, 2]);
    });

    it('does not allow progress bar value be less than 0%', async () => {
      const wrapper = await shallow(<ProgressBarsContainer/>);
      wrapper.setState({ selectedBar: 0 });

      expect(wrapper.state('bars')).to.eql([1, 10, 5]);

      wrapper.instance().updateProgressBarValue(-3);

      expect(wrapper.state('bars')).to.eql([0, 10, 5]);
      expect(wrapper.state('numberRates')).to.eql([-3, 2]);
    });

    it('handles increasing logic when selected bar is in a sring format', async () => {
      const wrapper = await shallow(<ProgressBarsContainer/>);
      wrapper.setState({ selectedBar: '1' });

      expect(wrapper.state('bars')).to.eql([1, 10, 5]);

      wrapper.instance().updateProgressBarValue(-3);

      expect(wrapper.state('bars')).to.eql([1, 7, 5]);
      expect(wrapper.state('numberRates')).to.eql([-3, 2]);
    });

    it('keeps selected bar after increase', async () => {
      const wrapper = await shallow(<ProgressBarsContainer/>);
      wrapper.setState({ selectedBar: 2 });

      expect(wrapper.state('bars')).to.eql([1, 10, 5]);

      wrapper.instance().updateProgressBarValue(2);

      expect(wrapper.state('bars')).to.eql([1, 10, 7]);
      expect(wrapper.state('numberRates')).to.eql([-3, 2]);
      expect(wrapper.state('selectedBar')).to.eql(2);
    });

    it('increases progress bar when number rate button is clicked', async () => {
      const wrapper = await mount(<ProgressBarsContainer/>);
      wrapper.update();

      expect(wrapper.state('bars')).to.eql([1, 10, 5]);

      wrapper.find('button[value="+2"]').simulate('click');

      expect(wrapper.state('bars')).to.eql([3, 10, 5]);
    });

    it('increases progress bar when number rate button is clicked given another selected bar', async () => {
      const wrapper = await mount(<ProgressBarsContainer/>);
      wrapper.setState({ selectedBar: 2 });
      wrapper.update();

      expect(wrapper.state('bars')).to.eql([1, 10, 5]);

      wrapper.find('button[value="+2"]').simulate('click');

      expect(wrapper.state('bars')).to.eql([1, 10, 7]);
    });
  });

  describe('Progress bar selection', () => {
    const bars = [1, 10, 5];
    const numberRates = [-3, 2];

    axios.get.returns(Promise.resolve({
      data: { bars: bars, buttons: numberRates }
    }));

    it('selects the first bar by default', async () => {
      const wrapper = await mount(<ProgressBarsContainer/>);

      expect(wrapper.state('selectedBar')).to.eql(0);
    });

    it('handles selection state change', async () => {
      const wrapper = await mount(<ProgressBarsContainer/>);

      wrapper.find('select').simulate('change', { target: { value: 1 } });

      expect(wrapper.state('selectedBar')).to.eql(1);
    });
  });

  describe('Title', () => {
    it('renders title', () => {
      const wrapper = shallow(<Title/>);

      expect(wrapper.text()).to.contain('Progress Bars');
    });
  });
});
