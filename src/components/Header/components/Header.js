import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'

import Sync from '../../../shared/sync';

import './Header.scss'

import ListIcon from './assets/list.svg';
import UserIcon from './assets/user.svg';
import ExportIcon from './assets/export.svg';

export default class Header extends Component {

  static get propTypes () {
    return {
      records: PropTypes.array.isRequired,
      currentPath: PropTypes.string.isRequired,
      setRecordSync: PropTypes.func.isRequired,
      removeRecord: PropTypes.func.isRequired,
      refreshIssue: PropTypes.func.isRequired
    };
  }

  constructor (props) {
    super(props);

    this.state = {};

    this.onSyncClick = this.onSyncClick.bind(this);
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
    location.href = '/jira-time';
  }

  onSyncClick () {
    const syncer = new Sync({
      records: this.props.records.map(r => r),
      setRecordSync: this.props.setRecordSync,
      removeRecord: this.props.removeRecord,
      refreshIssue: this.props.refreshIssue
    });

    syncer.on('syncStart', record => console.log('starting sync for record', record));
    syncer.on('syncEnd', record => console.log('finished sync for record', record));
    syncer.on('done', record => console.log('sync done'));
  }

  render () {

    // Signal that there is a new version ready to be installed
    let updateAvailable;
    if (this.state.serviceWorkerUpdated) {
      updateAvailable = (
        <div className='header__update-available' onClick={this.onUpdateAvailableClick}>Update available!</div>
      );
    }

    // Show sync icon if there are items to sync
    let sync;
    if (!!this.props.records.length) {
      sync = (
        <div className='header__button' onClick={this.onSyncClick} title='Sync to JIRA'>
          <img className='header__icon' src={ExportIcon} alt='Export' />
        </div>
      );
    }

    const classNameHome = this.props.currentPath === '/jira-time'
            ? 'header__button header__button--active'
            : 'header__button';
    const classNameProfile = this.props.currentPath === '/jira-time/profile'
            ? 'header__button header__button--active'
            : 'header__button';

    return (
      <div className='header'>
        <div className='header-left'>
          {updateAvailable}
        </div>
        <div className='header-center'>
          <IndexLink to='/jira-time' className={classNameHome}>
            <img className='header__icon' src={ListIcon} alt='Home' />
          </IndexLink>
          <Link to='/jira-time/profile' className={classNameProfile}>
            <img className='header__icon' src={UserIcon} alt='Profile' />
          </Link>
        </div>
        <div className='header-right'>
          {sync}
        </div>
      </div>
    );
  }
}
