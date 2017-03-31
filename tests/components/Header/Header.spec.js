import React from 'react';
import { Header } from 'components/Header/Header';
import { IndexLink, Link } from 'react-router';
import { shallow } from 'enzyme';

import ListIcon from 'components/Header/assets/list.svg';
import UserIcon from 'components/Header/assets/user.svg';

describe('(Component) Header', () => {
  let _wrapper;

  beforeEach(() => {
    _wrapper = shallow(<Header />)
  });

  describe('Navigation links...', () => {
    it('Should render a Link to Home route', () => {
      expect(_wrapper.contains(
        <IndexLink to='/' className='header__route' activeClassName='header__route--active'>
          <img className='header__route__icon' src={ListIcon} alt='Home' />
        </IndexLink>
      )).to.be.true;
    });

    it('Should render a Link to Profile route', () => {
      expect(_wrapper.contains(
        <Link to='/profile' className='header__route' activeClassName='header__route--active'>
          <img className='header__route__icon' src={UserIcon} alt='Profile' />
        </Link>
      )).to.be.true;
    });
  });
});
