import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import { ProgressBarsContainer, Title, ProgressBarList, Bar, BarSelector, ButtonList, NumberRateButton } from '../src/components';

describe('ProgressBarsContainer', () => {
  it('renders components', () => {
    const http = {
      get: (uri) => {
        return { data: {} }
      }
    };

    const wrapper = shallow(<ProgressBarsContainer http={http}/>);

    expect(wrapper.containsAllMatchingElements([
      <Title/>,
      <ProgressBarList/>,
      <BarSelector/>,
      <ButtonList/>
    ])).to.equal(true);
  });

  it('fetches data endpoint', async () => {
    const bars = [1, 2];
    const numberRates = [5, 6, 7];

    const http = {
      get: (uri) => {
        return Promise.resolve({
          data: { bars: bars, buttons: numberRates }
        });
      }
    };

    const wrapper = await shallow(<ProgressBarsContainer http={http}/>);
    const selectedBarChanged = wrapper.instance().selectedBarChanged;

    expect(wrapper.containsAllMatchingElements([
      <ProgressBarList bars={bars}/>,
      <BarSelector selectedBar={bars[0]} bars={bars} handleChange={selectedBarChanged}/>,
      <ButtonList numberRates={numberRates}/>
    ])).to.equal(true);
  });

  describe('Increasing/Decreasing progress bars', () => {
    const bars = [1, 10, 5];
    const numberRates = [-3, 2];

    const http = {
      get: (uri) => {
        return Promise.resolve({
          data: { bars: bars, buttons: numberRates }
        });
      }
    };

    it('increases bar percentage by rate number', async () => {
      const wrapper = await shallow(<ProgressBarsContainer http={http}/>);

      expect(wrapper.state('bars')).to.eql([1, 10, 5]);

      wrapper.instance().increase(2) ;

      expect(wrapper.state('bars')).to.eql([3, 10, 5]);
      expect(wrapper.state('numberRates')).to.eql([-3, 2]);
    });

    it('decreases bar percentage by rate number', async () => {
      const wrapper = await shallow(<ProgressBarsContainer http={http}/>);
      wrapper.setState({ selectedBar: 10 });

      expect(wrapper.state('bars')).to.eql([1, 10, 5]);

      wrapper.instance().increase(-3);

      expect(wrapper.state('bars')).to.eql([1, 7, 5]);
      expect(wrapper.state('numberRates')).to.eql([-3, 2]);
    });

    it('updates selected bar after increase', async () => {
      const wrapper = await shallow(<ProgressBarsContainer http={http}/>);
      wrapper.setState({ selectedBar: 5 });

      expect(wrapper.state('bars')).to.eql([1, 10, 5]);

      wrapper.instance().increase(2);

      expect(wrapper.state('bars')).to.eql([1, 10, 7]);
      expect(wrapper.state('numberRates')).to.eql([-3, 2]);
      expect(wrapper.state('selectedBar')).to.eql(7);
    });

    it('bind increase logic with Number Rate Button component', async () => {
      const wrapper = await mount(<ProgressBarsContainer http={http}/>);
      wrapper.update();

      expect(wrapper.state('bars')).to.eql([1, 10, 5]);

      wrapper.find('button[value="+2"]').simulate('click');

      expect(wrapper.state('bars')).to.eql([3, 10, 5]);
    });
  });

  describe('Progress bar selection', () => {
    const bars = [1, 10, 5];
    const numberRates = [-3, 2];

    const http = {
      get: (uri) => {
        return Promise.resolve({
          data: { bars: bars, buttons: numberRates }
        });
      }
    };

    it('selects the first bar by default', async () => {
      const wrapper = await mount(<ProgressBarsContainer http={http}/>);

      expect(wrapper.state('selectedBar')).to.eql(1);
    });

    it('handles selection state change', async () => {
      const wrapper = await mount(<ProgressBarsContainer http={http}/>);

      wrapper.find('select').simulate('change', { target: { value: 10 } });

      expect(wrapper.state('selectedBar')).to.eql(10);
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
      const wrapper = shallow(<BarSelector selectedBar={1} bars={[1, 10, 5]} handleChange={handleChange}/>);

      expect(wrapper.find('option')).to.have.length(3);

      expect(wrapper.html()).to.contain(`<option selected="" value="1">#progress1</option>`);
      expect(wrapper.html()).to.contain(`<option value="10">#progress2</option>`);
      expect(wrapper.html()).to.contain(`<option value="5">#progress3</option>`);
    });
  });

  describe('ButtonList', () => {
    it('not render rate numbers when items are undefined', () => {
      const wrapper = shallow(<ButtonList numberRates={undefined}/>);

      expect(wrapper.find('li')).to.have.length(0);
    });

    it('not render progress bars when items are empty', () => {
      const wrapper = shallow(<ButtonList numberRates={[]}/>);

      expect(wrapper.find('li')).to.have.length(0);
    });

    it('renders number rates appending positive/negative signs', () => {
      const click = () => {};
      const wrapper = mount(<ButtonList numberRates={[8, -2, 5]} handleClick={click}/>);

      const onClickFunction = wrapper.instance().handleClick;

      expect(wrapper.find('li')).to.have.length(3);

      expect(wrapper.contains(<NumberRateButton value={'+8'} handleClick={onClickFunction}/>)).to.equal(true);
      expect(wrapper.contains(<NumberRateButton value={'-2'} handleClick={onClickFunction}/>)).to.equal(true);
      expect(wrapper.contains(<NumberRateButton value={'+5'} handleClick={onClickFunction}/>)).to.equal(true);
    });
  });
});
