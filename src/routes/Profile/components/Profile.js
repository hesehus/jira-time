import React, { Component, PropTypes } from 'react'

import Login from '../../../components/Login';

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

    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.onLogoutClick = this.onLogoutClick.bind(this);
  }

  onLoginSuccess ({ username }) {
    this.props.setLoggedIn({ isLoggedIn: true, username });
  }

  onLogoutClick () {
    this.props.setLoggedIn({ isLoggedIn: false, username: this.props.profile.username });
  }

  render () {

    if (!this.props.profile.loggedIn) {
      return (<Login onLoginSuccess={this.onLoginSuccess} />);
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
