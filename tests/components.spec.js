import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import axios from 'axios';

import NumberRateButton from '../src/NumberRateButton';
import ButtonList from '../src/ButtonList';
import { ProgressBarsContainer, Title, ProgressBarList, Bar, BarSelector } from '../src/components';


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

  describe('ProgressBarList', () => {
    it('not render progress bars when items are undefined', () => {
      const wrapper = shallow(<ProgressBarList bars={undefined}/>);

      expect(wrapper.find('li')).to.have.length(0);
    });

    it('not render progress bars when items are empty', () => {
      const wrapper = shallow(<ProgressBarList bars={[]}/>);

      expect(wrapper.find('li')).to.have.length(0);
    });

    it('renders all given progress bars', () => {
      const wrapper = shallow(<ProgressBarList bars={[62, 45]}/>);

      expect(wrapper.find('li')).to.have.length(2);

      expect(wrapper.contains(<li><Bar value={62}/></li>)).to.equal(true);
      expect(wrapper.contains(<li><Bar value={45}/></li>)).to.equal(true);
    });

    describe('Bar', () => {
      it('renders percentual representation', () => {
        const wrapper = shallow(<Bar value={25}/>);

        expect(wrapper.text()).to.contain('25%');
      });

      it('renders 0% when value is undefined', () => {
        const wrapper = shallow(<Bar value={undefined}/>);

        expect(wrapper.text()).to.contain('0%');
      });

      it('renders 0% when value is less than 0', () => {
        const wrapper = shallow(<Bar value={-1}/>);

        expect(wrapper.text()).to.contain('0%');
      });

      it('renders percentual width representation when it is below 100%', () => {
        const wrapper = shallow(<Bar value={25}/>);

        expect(wrapper.instance().percentageWidth).to.eql('25%');
      });

      it('keeps percentual width as 100% when value is beyond 100%', () => {
        const wrapper = shallow(<Bar value={101}/>);

        expect(wrapper.instance().percentageWidth).to.eql('100%');
      });
    });
  });

  describe('BarSelector', () => {
    it('not render selected bar when progress bar list is empty', () => {
      const wrapper = shallow(<BarSelector selectedBar={undefined} bars={[]}/>);

      expect(wrapper.find('option')).to.have.length(0);
    });

    it('not render selected bar when progress bar list is undefined', () => {
      const wrapper = shallow(<BarSelector selectedBar={undefined} bars={undefined}/>);

      expect(wrapper.find('option')).to.have.length(0);
    });

    it('renders options for each progress bar available', () => {
      const handleChange = () => {};
      const wrapper = shallow(<BarSelector selectedBar={0} bars={[1, 10, 5]} handleChange={handleChange}/>);

      expect(wrapper.find('option')).to.have.length(3);

      expect(wrapper.html()).to.contain(`<option selected="" value="0">#progress1</option>`);
      expect(wrapper.html()).to.contain(`<option value="1">#progress2</option>`);
      expect(wrapper.html()).to.contain(`<option value="2">#progress3</option>`);
    });
  });
});
