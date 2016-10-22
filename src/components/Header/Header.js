import React from 'react'
import { IndexLink, Link } from 'react-router'
import './Header.scss'
import HomeIcon from './assets/home.svg';
import ListIcon from './assets/list.svg';
import UserIcon from './assets/user.svg';

export const Header = () => (
  <div className='top-links'>
    <IndexLink to='/jira-time' className='top-links__route' activeClassName='top-links__route--active'>
      <img className='top-links__route__icon' src={ListIcon} alt='Tasks' />
    </IndexLink>
    <Link to='/jira-time/profile' className='top-links__route' activeClassName='top-links__route--active'>
      <img className='top-links__route__icon' src={UserIcon} alt='Profile' />
    </Link>
  </div>
)

export default Header
