import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import ButtonList from '../src/ButtonList';
import NumberRateButton from '../src/NumberRateButton';

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
