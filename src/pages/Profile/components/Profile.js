import React, { Component, PropTypes } from 'react'

import { logout } from 'shared/jiraClient';

import Login from 'modules/Login';

import './Profile.scss';

export class Profile extends Component {

  static get propTypes () {
    return {
      profile: PropTypes.object.isRequired,
      setLoggedIn: PropTypes.func.isRequired
    };
  }

  constructor (props) {
    super(props);

    this.onLogoutClick = this.onLogoutClick.bind(this);
  }

  onLogoutClick () {
    logout();
    this.props.setLoggedIn({ isLoggedIn: false });
  }

  render () {

    if (!this.props.profile.loggedIn) {
      return (<Login />);
    }

    const { username } = this.props.profile;

    return (
      <div className='profile'>
        <div>Username: {username}</div>
        <button className='profile-logout' onClick={this.onLogoutClick}>Log out</button>
      </div>
    );
  }
}

export default Profile;
