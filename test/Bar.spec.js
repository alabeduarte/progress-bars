import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import Bar from '../src/Bar';

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
