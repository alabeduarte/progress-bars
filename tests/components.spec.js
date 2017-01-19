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
    });
  });
});
