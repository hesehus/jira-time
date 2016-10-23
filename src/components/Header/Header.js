import React from 'react'
import { IndexLink, Link } from 'react-router'
import './Header.scss'
import ListIcon from './assets/list.svg';
import UserIcon from './assets/user.svg';

export const Header = () => (
  <div className='header'>
    <IndexLink to='/jira-time' className='header__route' activeClassName='header__route--active'>
      <img className='header__route__icon' src={ListIcon} alt='Home' />
    </IndexLink>
    <Link to='/jira-time/profile' className='header__route' activeClassName='header__route--active'>
      <img className='header__route__icon' src={UserIcon} alt='Profile' />
    </Link>
  </div>
)

export default Header
