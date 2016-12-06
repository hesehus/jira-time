import moment from 'moment';
import React, { Component, PropTypes } from 'react';

import { getWorkLogs } from 'shared/jiraClient';
import HistoryRecordItem from 'modules/HistoryRecordItem';

import LoadingIcon from 'assets/loading.svg';

import './Summary.scss';

export default class Summary extends Component {

  static get propTypes () {
    return {
      profile: PropTypes.object.isRequired,
      notSyncedRecords: PropTypes.array.isRequired,
      activeRecord: PropTypes.object
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
    let { notSyncedRecords, activeRecord } = this.props;

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
          No worklogs found today
        </div>
      );
    }

    if (activeRecord) {
      notSyncedRecords = notSyncedRecords.filter(r => r.cuid !== activeRecord.cuid);
    }

    let outputRecords = [...notSyncedRecords, ...records];

    // Ensure momentified dates
    outputRecords = outputRecords.map((r) => {
      r.startTime = moment(r.startTime);
      r.endTime = moment(r.endTime || new Date());
      return r;
    });

    // Sort by time started
    outputRecords = outputRecords.sort((a, b) => a.startTime > b.startTime);

    let duration = moment.duration();
    outputRecords.forEach(r => duration.add(r.endTime.unix() - r.startTime.unix(), 'seconds'));
    duration.add(moment(activeRecord.endTime || new Date()).unix() - moment(activeRecord.startTime).unix(), 'seconds');

    return (
      <div className='summary'>
        <table className='summary-table'>
          {outputRecords.map(record => <HistoryRecordItem record={record} />)}
          {activeRecord ? <HistoryRecordItem record={activeRecord} /> : null}
        </table>
        <div>Total: {duration.hours()}h {duration.minutes()}m {duration.seconds()}s</div>
      </div>
    );
  }
}
