import React, { Component } from 'react'
import { IndexLink, Link } from 'react-router'
import './Header.scss'
import ListIcon from './assets/list.svg';
import UserIcon from './assets/user.svg';

export default class Header extends Component {

  constructor (props) {
    super(props);

    this.state = {};
  }

  componentWillMount () {
    if (window.__getServiceWorkerStatus) {
      window.__getServiceWorkerStatus
        .then((status) => {
          this.setState({ serviceWorkerUpdated: status.updateAvailable });
        });
    }
  }

  onUpdateAvailableClick () {
    location.reload();
  }

  render () {

    let updateAvailable;
    if (this.state.serviceWorkerUpdated) {
      updateAvailable = <div onClick={this.onUpdateAvailableClick}>Update available!</div>;
    }

    return (
      <div className='header'>
        <IndexLink to='/jira-time' className='header__route' activeClassName='header__route--active'>
          <img className='header__icon' src={ListIcon} alt='Home' />
        </IndexLink>
        <Link to='/jira-time/profile' className='header__route' activeClassName='header__route--active'>
          <img className='header__icon' src={UserIcon} alt='Profile' />
        </Link>
        {updateAvailable}
      </div>
    );
  }
}
