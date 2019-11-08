import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {withRouter} from 'react-router-dom';

import Sync, { sharedEvents } from 'shared/sync';
import { showAddIssuesDialog } from 'shared/helpers';

import './Header.scss';

import Loader from 'modules/Loader';

import AppLogoIcon from 'assets/logo-100.png';
import UserIcon from 'assets/user.svg';
import SyncIcon from 'assets/sync.svg';
import RefreshIcon from 'assets/refresh.svg';
import CalendarIcon from 'assets/calendar.svg';
import ListViewIcon from 'assets/list-view.svg';

class Header extends Component {
    static get propTypes() {
        return {
            records: PropTypes.array.isRequired,
            loggedIn: PropTypes.bool.isRequired
        };
    }

    constructor(props) {
        super(props);

        this.state = {};

        this.onSyncClick = this.onSyncClick.bind(this);
        this.onProcessAllStart = this.onProcessAllStart.bind(this);
        this.onProcessAllDone = this.onProcessAllDone.bind(this);
        this.onHashChange = this.onHashChange.bind(this);
    }

    componentDidMount() {
        if (window.__getServiceWorkerStatus) {
            window.__getServiceWorkerStatus.then(status => {
                this.setState({
                    serviceWorkerUpdated: status.updateAvailable
                });
            });
        }

        // Listen for events from the syncer
        sharedEvents.on('processAllStart', this.onProcessAllStart);
        sharedEvents.on('processAllDone', this.onProcessAllDone);

        this.onHashChange();
    }

    componentWillUnmount() {
        sharedEvents.off('processAllStart', this.onProcessAllStart);
        sharedEvents.off('processAllDone', this.onProcessAllDone);
    }

    onHashChange() {
        let path = '';
        if(this.props.location){
            path = this.props.location.pathname;
        }
        this.setState({
            currentPathname: path
        });
    }

    onProcessAllStart() {
        this.setState({
            syncing: true
        });
    }

    onProcessAllDone() {
        this.setState({
            syncing: false
        });
    }

    onUpdateAvailableClick() {
        location.reload();
    }

    onSyncClick() {
        Sync.processAllInState();
    }

    someRecordsCanBeSynced() {
        return !!this.props.records.find(r => !!r.endTime && !!r.comment);
    }

    render() {
        if (!this.props.loggedIn) {
            return <div />;
        }

        const { syncing, serviceWorkerUpdated, currentPathname } = this.state;

        // Signal that there is a new version ready to be installed
        let updateAvailable;
        if (serviceWorkerUpdated) {
            updateAvailable = (
                <div className="update-available" onClick={this.onUpdateAvailableClick}>
                    <img src={RefreshIcon} alt="refresh" className="update-available-icon" />
                    Update available!
                </div>
            );
        }

        // Define the sync button
        let className = 'header__button header-sync';
        let onClick = this.onSyncClick;
        let title = 'Sync all worklogs to JIRA';

        if (!this.someRecordsCanBeSynced()) {
            className += ' header-sync--inactive';
            onClick = null;
            title = 'No worklogs to sync, yo!';
        } else if (syncing) {
            className += ' header-sync--syncing';
            onClick = null;
            title = 'Syncing!';
        }

        let sync = (
            <div className={className} onClick={onClick} title={title} style={{ backgroundImage: `url(${SyncIcon})` }}>
                {syncing ? <Loader size="tiny" /> : 'Sync'}
            </div>
        );

        let classNameHome = 'header__button header__button--home';
        let classNameProfile = 'header__button header__button--profile';
        let classNameSummary = 'header__button header__button--summary';

        switch (currentPathname) {
            case '/profile': {
                classNameProfile += ' header__button--active';
                break;
            }
            case '/summary': {
                classNameSummary += ' header__button--active';
                break;
            }
            default: {
                classNameHome += ' header__button--active';
            }
        }

        return (
            <div className="header">
                <div className="header__left">
                    <div className="header-title">
                        <img
                            className="header-logo"
                            src={AppLogoIcon}
                            alt="Abstract hour glass"
                            onClick={showAddIssuesDialog}
                        />
                        <span className="header-title-text">JIRA-time</span>
                    </div>
                    {updateAvailable}
                </div>
                <div className="header__right">
                    <Link  to="/" className={classNameHome} title="Tasks">
                        <img className="header__icon" src={ListViewIcon} alt="Home" />
                    </Link >
                    <Link  to="/summary" className={classNameSummary} title="Summary">
                        <img className="header__icon" src={CalendarIcon} alt="Calendar" />
                    </Link >
                    <Link  to="/profile" className={classNameProfile} title="Profile">
                        <img className="header__icon" src={UserIcon} alt="Profile" />
                    </Link >
                    {sync}
                </div>
            </div>
        );
    }
}

export default withRouter(props => <Header {...props}/>);