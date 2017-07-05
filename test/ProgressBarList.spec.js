import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import ProgressBarList from '../src/ProgressBarList';
import Bar from '../src/Bar';

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
});
