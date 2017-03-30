import React, { Component, PropTypes } from 'react'
import moment from 'moment';

import { logout, updateUserInfo } from 'shared/jiraClient';

import ThemeSelector from 'modules/ThemeSelector';
import Login from 'modules/Login';
import UserIcon from 'assets/user.svg';
import changelog from 'changelog.json';

import './Profile.scss';

const browserHasSpeechRecognition = 'webkitSpeechRecognition' in window;

export class Profile extends Component {

    static get propTypes () {
        return {
            profile: PropTypes.object.isRequired,
            setLoggedIn: PropTypes.func.isRequired,
            setUserPreferences: PropTypes.func.isRequired
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

    updateUserPreferences ({ connectToSyncServer, enableVoiceRecording }) {
        let preferences = { ...this.props.profile.preferences };
        
        if (typeof connectToSyncServer !== 'undefined') {
            preferences.connectToSyncServer = connectToSyncServer;
        }
        if (typeof enableVoiceRecording !== 'undefined') {
            preferences.enableVoiceRecording = enableVoiceRecording;
        }

        this.props.setUserPreferences({ preferences });
    }

    render () {

        if (!this.props.profile.loggedIn) {
            return <Login />;
        }

        const { userinfo, preferences } = this.props.profile;
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
                    <div className='profile-preferences'>
                        <div className='profile-preferences-field'
                          style={{ display: browserHasSpeechRecognition ? 'block' : 'none' }}>
                            <label>
                                <span className='profile-preferences-label'>Enable voice recording</span>
                                <input className='profile-preferences-input'
                                  type='checkbox'
                                  checked={preferences.enableVoiceRecording}
                                  onChange={e => this.updateUserPreferences({
                                      enableVoiceRecording: e.target.checked
                                  })}
                                />
                            </label>
                        </div>
                        <div className='profile-preferences-field'>
                            <label>
                                <span className='profile-preferences-label'>Connect to sync server</span>
                                <input className='profile-preferences-input'
                                  type='checkbox'
                                  checked={preferences.connectToSyncServer}
                                  onChange={e => this.updateUserPreferences({
                                      connectToSyncServer: e.target.checked
                                  })}
                                />
                            </label>
                        </div>
                    </div>

                    <div className='profile-shortcuts-heading'>App shortcuts</div>
                    <table className='profile-shortcuts'>
                        <tbody>
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
                        </tbody>
                    </table>
                    <button className='profile-logout btn' onClick={this.onLogoutClick}>Log out</button>
                    <div className='app-version' title={changelogTitle}>Version: {version}</div>
                </div>
            </div>
        );
    }
}

export default Profile;
