import React, { Component, PropTypes } from 'react'
import moment from 'moment';

import { logout, updateUserInfo } from 'shared/jiraClient';

import ThemeSelector from 'modules/ThemeSelector';
import Login from 'modules/Login';
import UserIcon from 'assets/user.svg';
import changelog from 'shared/changelog.json';

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
        const { version, changes = [], date } = changelog[0];
        const changelogTitle = moment(date).format('lll') + ':\n' + changes.join('/n');

        let avatarUrl = UserIcon;
        const avatarSize = '48x48';
        if (avatarUrls) {
            avatarUrl = avatarUrls[avatarSize].replace('http://localhost:3000', '/');
        }

        return (
            <div className='profile'>
                <div className='profile-avatar'>
                    <img className='profile-avatar-img' src={avatarUrl} alt={userinfo.name} title={userinfo.name} />
                </div>
                <ThemeSelector />
                <div className='profile-bottom'>
                    <div className='profile-shortcuts-heading'>App shortcuts</div>
                    <table className='profile-shortcuts'>
                        <tr>
                            <td className='profile-shortcuts-cell'>A:</td>
                            <td className='profile-shortcuts-cell'>add issue(s)</td>
                        </tr>
                        <tr>
                            <td className='profile-shortcuts-cell'>UP/DOWN in comment:</td>
                            <td className='profile-shortcuts-cell'>navigate between worklog comments</td>
                        </tr>
                        <tr>
                            <td className='profile-shortcuts-cell'>CTR+F:</td>
                            <td className='profile-shortcuts-cell'>search in tasks list</td>
                        </tr>
                        <tr>
                            <td className='profile-shortcuts-cell'>CTR+S:</td>
                            <td className='profile-shortcuts-cell'>sync all worklogs</td>
                        </tr>
                    </table>
                    <button className='profile-logout btn' onClick={this.onLogoutClick}>Log out</button>
                    <div className='app-version' title={changelogTitle}>Version: {version}</div>
                </div>
            </div>
        );
    }
}

export default Profile;
