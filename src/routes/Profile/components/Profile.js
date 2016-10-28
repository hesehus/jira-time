import React, { Component, PropTypes } from 'react'

import Login from '../../Login';
import { setLoggedIn } from '../modules/profile';

import './Profile.scss';

export class Profile extends Component {

  static get propTypes () {
    return {
      profile: PropTypes.object.isRequired,
      dispatch: PropTypes.func.isRequired
    };
  }

  constructor (props) {
    super(props);

    this.onLoginSuccess = this.onLoginSuccess.bind(this);
  }

  onLoginSuccess ({ username }) {
    this.props.setLoggedIn({ isLoggedIn: true, username });
  }

  render () {

    if (!this.props.profile.loggedIn) {
      return (<Login onLoginSuccess={this.onLoginSuccess} />);
    }

    const { username } = this.props.profile;

    return (
      <div className='profile'>
        <div>Username: {username}</div>
      </div>
    );
  }
}

export default Profile;
