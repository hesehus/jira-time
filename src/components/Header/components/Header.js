import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'

import Sync from '../../../shared/sync';
import { getIssue } from '../../../shared/jiraClient';

import './Header.scss'

import ListIcon from '../../../assets/list.svg';
import UserIcon from '../../../assets/user.svg';
import ExportIcon from '../../../assets/export.svg';
import LoadingIcon from '../../../assets/loading.svg';

export default class Header extends Component {

  static get propTypes () {
    return {
      records: PropTypes.array.isRequired,
      currentPath: PropTypes.string.isRequired,
      loggedIn: PropTypes.bool.isRequired,
      setRecordSync: PropTypes.func.isRequired,
      removeRecord: PropTypes.func.isRequired,
      refreshIssue: PropTypes.func.isRequired,
      setIssueRefreshing: PropTypes.func.isRequired
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
    
    this.setState({
      syncing: true
    });

    const syncer = new Sync({
      records: this.props.records.map(r => r),
      setRecordSync: this.props.setRecordSync,
      removeRecord: this.props.removeRecord
    });

    syncer.on('syncDone', () => {
      this.setState({
        syncing: false
      });
    });

    syncer.on('syncTaskDone', ({ record, nextRecord }) => {
      
      // Refresh issue info when all the records for the task is synced
      if (!nextRecord || record.taskCuid !== nextRecord.taskCuid) {

        this.props.setIssueRefreshing({
          cuid: record.taskCuid,
          refreshing: true
        });

        getIssue({
          id: record.taskIssueKey
        })
        .then((issue) => {
          this.props.refreshIssue({
            cuid: record.taskCuid,
            issue
          });
        });
      }
    });

    syncer.start();
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
    if (this.state.syncing) {
      sync = (
        <div className='header__button header__button--syncing' title='Syncing!'>
          <img className='header__icon' src={LoadingIcon} alt='Loading' />
        </div>
      );
    } else if (!!this.props.records.length) {
      sync = (
        <div className='header__button' onClick={this.onSyncClick} title='Sync to JIRA'>
          <img className='header__icon' src={ExportIcon} alt='Export' />
        </div>
      );
    }

    let homeLink = (
      <IndexLink to='/jira-time' className='header__button' activeClassName='header__button--active'>
        <img className='header__icon' src={ListIcon} alt='Home' />
      </IndexLink>
    );

    return (
      <div className='header'>
        <div className='header-left'>
          {updateAvailable}
        </div>
        <div className='header-center'>
          {this.props.loggedIn ? homeLink : null}
          <Link to='/jira-time/profile' className='header__button' activeClassName='header__button--active'>
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
