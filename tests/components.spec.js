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
});
