import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import { ProgressBarsContainer, Title, Bars, BarsSelector, Buttons } from '../src/components';

describe('ProgressBarsContainer', () => {
  it('renders components', () => {
    const wrapper = shallow(<ProgressBarsContainer/>);

    expect(wrapper.containsAllMatchingElements([
      <Title/>,
      <Bars/>,
      <BarsSelector/>,
      <Buttons/>
    ])).to.equal(true);
  });

  describe('Title', () => {
    it('renders title', () => {
      const wrapper = shallow(<Title/>);

      expect(wrapper.text()).to.contain('Progress Bars');
    });
  });

  describe('Bars', () => {
    it('not render progress bars when items are undefined', () => {
      const wrapper = shallow(<Bars progressBars={undefined}/>);

      expect(wrapper.find('li')).to.have.length(0);
    });

    it('not render progress bars when items are empty', () => {
      const wrapper = shallow(<Bars progressBars={[]}/>);

      expect(wrapper.find('li')).to.have.length(0);
    });

    it('renders all given progress bars', () => {
      const wrapper = shallow(<Bars progressBars={[62, 45]}/>);

      expect(wrapper.find('li')).to.have.length(2);

      expect(wrapper.html()).to.contain('<li>62</li>');
      expect(wrapper.html()).to.contain('<li>45</li>');
    });
  });

  describe('Buttons', () => {
    it('not render rate numbers when items are undefined', () => {
      const wrapper = shallow(<Buttons rateNumbers={undefined}/>);

      expect(wrapper.find('li')).to.have.length(0);
    });

    it('not render progress bars when items are empty', () => {
      const wrapper = shallow(<Buttons rateNumbers={[]}/>);

      expect(wrapper.find('li')).to.have.length(0);
    });

    it('renders all given progress bars', () => {
      const wrapper = mount(<Buttons rateNumbers={[8, -2, 5]}/>);

      expect(wrapper.find('li')).to.have.length(3);

      expect(wrapper.html()).to.contain('<li><button>+8</button></li>');
      expect(wrapper.html()).to.contain('<li><button>-2</button></li>');
      expect(wrapper.html()).to.contain('<li><button>+5</button></li>');
    });
  });
});
