import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import BarSelector from '../src/BarSelector';

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
