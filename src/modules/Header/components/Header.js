import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'

import Sync, { sharedEvents } from 'shared/sync';

import './Header.scss'

import UserIcon from 'assets/user.svg';
import SyncIcon from 'assets/sync.svg';
import LoadingIcon from 'assets/loading.svg';
import RefreshIcon from 'assets/refresh.svg';
import CalendarIcon from 'assets/calendar.svg';
import ListViewIcon from 'assets/list-view.svg';

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
        this.onProcessAllStart = this.onProcessAllStart.bind(this);
        this.onProcessAllDone = this.onProcessAllDone.bind(this);
    }

    componentDidMount () {
        if (window.__getServiceWorkerStatus) {
            window.__getServiceWorkerStatus
            .then((status) => {
                this.setState({
                    serviceWorkerUpdated: status.updateAvailable
                });
            });
        }

        // Listen for events from the syncer
        sharedEvents.on('processAllStart', this.onProcessAllStart);
        sharedEvents.on('processAllDone', this.onProcessAllDone);
    }

    componentWillUnmount () {
        sharedEvents.off('processAllStart', this.onProcessAllStart);
        sharedEvents.off('processAllDone', this.onProcessAllDone);
    }

    onProcessAllStart () {
        this.setState({
            syncing: true
        });
    }

    onProcessAllDone () {
        this.setState({
            syncing: false
        });
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
                <div
                  className='header__button header-sync header-sync--syncing'
                  title='Syncing...'
                  style={{ backgroundImage: `url(${LoadingIcon})` }}
                 />
            );
        } else if (!!this.props.records.length) {
            sync = (
                <div
                  className='header__button header-sync'
                  onClick={this.onSyncClick}
                  title='Sync all worklogs to JIRA'
                  style={{ backgroundImage: `url(${SyncIcon})` }}>
                    Sync
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

        return (
            <div className='header'>
                <div className='header__left'>
                    <div className='header-title'>JIRA-time</div>
                    {updateAvailable}
                </div>
                <div className='header__center' />
                <div className='header__right'>
                    <Link to='/summary' className={classNameSummary}>
                        <img className='header__icon' src={CalendarIcon} alt='Calendar' />
                    </Link>
                    <IndexLink to='/' className={classNameHome}>
                        <img className='header__icon' src={ListViewIcon} alt='Home' />
                    </IndexLink>
                    <Link to='/profile' className={classNameProfile}>
                        <img className='header__icon' src={UserIcon} alt='Profile' />
                    </Link>
                    {this.props.loggedIn ? sync : null}
                </div>
            </div>
        );
    }
}
