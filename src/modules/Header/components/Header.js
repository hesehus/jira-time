import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'

import Sync from 'shared/sync';
import { getIssue } from 'shared/jiraClient';

import './Header.scss'

import ListIcon from 'assets/list.svg';
import UserIcon from 'assets/user.svg';
import ExportIcon from 'assets/export.svg';
import LoadingIcon from 'assets/loading.svg';
import RefreshIcon from 'assets/refresh.svg';
import ChristmasTree from 'assets/christmas-tree.png';

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
    document.addEventListener('keydown', function onKeyDown (e) {
      if (e.ctrlKey) {
        let charCode = e.keyCode || e.which;
        let charStr = String.fromCharCode(charCode);
        if (charStr === 'S') {
          e.preventDefault();
          let syncButton = document.getElementById('sync-button');
          if (syncButton) syncButton.click();
        }
      }
      if (e.altKey) {

      }
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
          key: record.taskIssueKey
        })
        .then((issue) => {
          this.props.refreshIssue({
            cuid: record.taskCuid,
            issue
          });
        })
        .catch(() => {
          this.props.setIssueRefreshing({
            cuid: record.taskCuid,
            refreshing: false
          });
        });
      }
    });

    syncer.start();
  }

  render () {

    if (!this.props.loggedIn) {
      return null;
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

    switch (this.props.currentPath) {
      case '/profile' : {
        classNameProfile += ' header__button--active';
        break;
      }

      default : {
        classNameHome += ' header__button--active';
      }
    }

    return (
      <div className='header'>
        <div className='header-left'>
          {updateAvailable}
          <img className='header-christmas-tree' src={ChristmasTree} alt='Christmas tree' title='God jul!' />
        </div>
        <div className='header-center'>
          <IndexLink to='/' className={classNameHome}>
            <img className='header__icon' src={ListIcon} alt='Home' />
          </IndexLink>
          <Link to='/profile' className={classNameProfile}>
            <img className='header__icon' src={UserIcon} alt='Profile' />
          </Link>
        </div>
        <div className='header-right'>
          {this.props.loggedIn ? sync : null}
        </div>
      </div>
    );
  }
}
