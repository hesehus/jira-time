import React, { Component, PropTypes } from 'react'

import { logout, updateUserInfo } from 'shared/jiraClient';

import Login from 'modules/Login';

import './Profile.scss';

export class Profile extends Component {

    static get propTypes () {
        return {
            profile: PropTypes.object.isRequired,
            setLoggedIn: PropTypes.func.isRequired,
            setUserInfo: PropTypes.func.isRequired
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

    componentWillMount () {
        updateUserInfo();
    }

    render () {

        if (!this.props.profile.loggedIn) {
            return (<Login />);
        }

        const { username } = this.props.profile;

        return (
            <div className='profile'>
                <div>Username: {username}</div>
                <div>App shortcuts: ALT+a: add issue(s)</div>
                <button className='profile-logout' onClick={this.onLogoutClick}>Log out</button>
            </div>
        );
    }
}

export default Profile;
