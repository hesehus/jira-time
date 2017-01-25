import React, { Component, PropTypes } from 'react'

import { logout, updateUserInfo } from 'shared/jiraClient';

import ThemeSelector from 'modules/ThemeSelector';
import Login from 'modules/Login';
import UserIcon from 'assets/user.svg';

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
            return <Login />;
        }

        const { userinfo } = this.props.profile;
        const { avatarUrls } = userinfo;

        let avatarUrl = UserIcon;
        const avatarSize = '48x48';
        if (avatarUrls) {
            avatarUrl = avatarUrls[avatarSize].replace('http://localhost:3000', '/');
        }

        return (
            <div className='profile'>
                <img className='profile-avatar' src={avatarUrl} alt={userinfo.name} />
                <ThemeSelector />
                <div>
                    App shortcuts
                    <ul>
                        <li>ALT+a: add issue(s)</li>
                        <li>ALT+(up/down): navigate between worklog comments</li>
                        <li>CTR+F: search in tasks list</li>
                        <li>CTR+S: sync all worklogs</li>
                    </ul>
                </div>
                <button className='profile-logout btn' onClick={this.onLogoutClick}>Log out</button>
            </div>
        );
    }
}

export default Profile;
