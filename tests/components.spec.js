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

    expect(wrapper.containsAllMatchingElements([
      <ProgressBarList bars={bars}/>,
      <BarSelector bars={bars}/>,
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

      wrapper.instance().increase(0, 1) ;

      expect(wrapper.state('bars')).to.eql([3, 10, 5]);
      expect(wrapper.state('numberRates')).to.eql([-3, 2]);
    });

    it('decreases bar percentage by rate number', async () => {
      const wrapper = await shallow(<ProgressBarsContainer http={http}/>);

      wrapper.instance().increase(1, 0);

      expect(wrapper.state('bars')).to.eql([1, 7, 5]);
      expect(wrapper.state('numberRates')).to.eql([-3, 2]);
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
      const wrapper = shallow(<BarSelector bars={[]}/>);

      expect(wrapper.find('option')).to.have.length(0);
    });

    it('not render selected bar when progress bar list is undefined', () => {
      const wrapper = shallow(<BarSelector bars={undefined}/>);

      expect(wrapper.find('option')).to.have.length(0);
    });

    it('selects the first bar by default', () => {
      const wrapper = shallow(<BarSelector bars={[30, 44]}/>);

      expect(wrapper.find('option')).to.have.length(2);

      expect(wrapper.html()).to.contain(`<option selected="" value="30">#progress1</option>`);
      expect(wrapper.html()).to.contain(`<option value="44">#progress2</option>`);
    });

    it('handles selection state change', () => {
      const wrapper = shallow(<BarSelector bars={[1, 2, 3]}/>);

      expect(wrapper.html()).to.contain(`<option selected="" value="1">#progress1</option>`);
      expect(wrapper.html()).to.contain(`<option value="2">#progress2</option>`);
      expect(wrapper.html()).to.contain(`<option value="3">#progress3</option>`);

      wrapper.find('select').simulate('change', { target: { value: 2 } });

      expect(wrapper.html()).to.contain(`<option value="1">#progress1</option>`);
      expect(wrapper.html()).to.contain(`<option selected="" value="2">#progress2</option>`);
      expect(wrapper.html()).to.contain(`<option value="3">#progress3</option>`);
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
      const wrapper = mount(<ButtonList numberRates={[8, -2, 5]}/>);

      expect(wrapper.find('li')).to.have.length(3);

      expect(wrapper.contains(<li><NumberRateButton value={'+8'}></NumberRateButton></li>)).to.equal(true);
      expect(wrapper.contains(<li><NumberRateButton value={'-2'}></NumberRateButton></li>)).to.equal(true);
      expect(wrapper.contains(<li><NumberRateButton value={'+5'}></NumberRateButton></li>)).to.equal(true);
    });
  });
});
