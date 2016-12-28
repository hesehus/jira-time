import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'

import Sync, { sharedEvents } from 'shared/sync';

import './Header.scss'

import ListIcon from 'assets/list.svg';
import UserIcon from 'assets/user.svg';
import ExportIcon from 'assets/export.svg';
import LoadingIcon from 'assets/loading.svg';
import RefreshIcon from 'assets/refresh.svg';
import CalendarIcon from 'assets/calendar.svg';
import ChristmasTree from 'assets/christmas-tree.png';

export default class Header extends Component {

  static get propTypes () {
    return {
      records: PropTypes.array.isRequired,
      currentPath: PropTypes.string.isRequired,
      loggedIn: PropTypes.bool.isRequired,
      refreshIssue: PropTypes.func.isRequired,
      setIssueRefreshing: PropTypes.func.isRequired,
      profile: PropTypes.object.isRequired
    };
  }

  constructor (props) {
    super(props);

    this.state = {};

    this.onSyncClick = this.onSyncClick.bind(this);

    // Listen for events from the syncer
    sharedEvents.on('processAllStart', () => {
      this.setState({
        syncing: true
      });
    });
    sharedEvents.on('processAllDone', () => {
      this.setState({
        syncing: false
      });
    });
  }

  componentWillMount () {
    if (window.__getServiceWorkerStatus) {
      window.__getServiceWorkerStatus
        .then((status) => {
          this.setState({
            serviceWorkerUpdated: status.updateAvailable
          });
        });
    }
  }

  onUpdateAvailableClick () {
    location.reload();
  }

  onSyncClick () {
    Sync.processAllInState();
  }

  render () {

    if (!this.props.loggedIn) {
      return <div />;
    }

    // Signal that there is a new version ready to be installed
    let updateAvailable;
    if (this.state.serviceWorkerUpdated) {
      updateAvailable = (
        <div className='update-available' onClick={this.onUpdateAvailableClick}>
          <img src={RefreshIcon} alt='refresh' className='update-available-icon' />
          Update available!
        </div>
      );
    }

    // Show sync icon if there are items to sync
    let sync;
    if (this.state.syncing) {
      sync = (
        <div className='header__button header__button--syncing' title='Syncing!'>
          <img className='header__icon' src={LoadingIcon} alt='Loading' />
        </div>
      );
    } else if (!!this.props.records.length) {
      sync = (
        <div id='sync-button' className='header__button' onClick={this.onSyncClick} title='Sync all worklogs to JIRA'>
          <img className='header__icon' src={ExportIcon} alt='Export' />
        </div>
      );
    }

    let classNameHome = 'header__button';
    let classNameProfile = 'header__button';
    let classNameSummary = 'header__button';

    switch (this.props.currentPath) {
      case '/profile' : {
        classNameProfile += ' header__button--active';
        break;
      }
      case '/summary' : {
        classNameSummary += ' header__button--active';
        break;
      }
      default : {
        classNameHome += ' header__button--active';
      }
    }

    let avatarUrl = UserIcon;

    const avatarUrls = this.props.profile.userinfo.avatarUrls;
    const avatarSize = '48x48';

    if (this.props.profile && this.props.profile.userinfo.avatarUrls) {
      avatarUrl = avatarUrls[avatarSize];
      avatarUrl = avatarUrl.replace('http://localhost:3000', 'https://jira.hesehus.dk');
      classNameProfile = classNameProfile + ' header__button--avatar';
    }

    return (
      <div className='header'>
        <div className='header__left'>
          <img className='header-christmas-tree' src={ChristmasTree} alt='Christmas tree' title='God jul!' />
          {updateAvailable}
        </div>
        <div className='header__center'>
          <Link to='/summary' className={classNameSummary}>
            <img className='header__icon' src={CalendarIcon} alt='Calendar' />
          </Link>
          <IndexLink to='/' className={classNameHome}>
            <img className='header__icon' src={ListIcon} alt='Home' />
          </IndexLink>
          <Link to='/profile' className={classNameProfile}>
            <img className='header__icon' src={avatarUrl} alt='Profile' />
          </Link>
        </div>
        <div className='header__right'>
          {this.props.loggedIn ? sync : null}
        </div>
      </div>
    );
  }
}
