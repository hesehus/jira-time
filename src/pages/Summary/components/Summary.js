import moment from 'moment';
import React, { Component, PropTypes } from 'react';

import { getWorkLogs } from 'shared/jiraClient';
import SyncedRecordItem from 'modules/SyncedRecordItem';

import LoadingIcon from 'assets/loading.svg';

import './Summary.scss';

export default class Summary extends Component {

  static get propTypes () {
    return {
      profile: PropTypes.object.isRequired
    }
  }

  constructor (props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  componentDidMount () {

    const startDate = moment().second(0).minute(0).hour(0);
    const endDate = moment().second(0).minute(0).hour(0).add(1, 'days');

    getWorkLogs({
      startDate,
      endDate,
      username: this.props.profile.username
    })
    .then(records => this.setState({ loading: false, records }))
    .catch(() => this.setState({ loading: false, error: 'Could not get worklogs' }));
  }

  render () {

    const { loading, records } = this.state;

    if (!records || loading) {
      return (
        <div className='summary summary--loading'>
          <img src={LoadingIcon} alt='Loading' />
        </div>
      );
    }

    if (records && records.length === 0) {
      return (
        <div className='summary summary--no-found'>
          No worklogs found
        </div>
      );
    }

    let totalSeconds = 0;
    records.forEach(r => totalSeconds += r.timeSpentSeconds);

    let hours = Math.floor(totalSeconds / 60 / 60);
    let minutes = Math.floor((totalSeconds - (hours * 60 * 60)) / 60);

    return (
      <div className='summary'>
        <table className='summary-table'>
          {records.map(record => <SyncedRecordItem record={record} />)}
        </table>
        <div>Total: {hours}h {minutes}m</div>
      </div>
    );
  }
}
