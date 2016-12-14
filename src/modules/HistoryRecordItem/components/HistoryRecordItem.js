import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import TimeInput from 'time-input';

import { getElapsedTime } from 'store/reducers/recorder';

import ExportIcon from 'assets/export.svg';

import './HistoryRecordItem.scss';

export default class HistoryRecordItem extends Component {

  static propTypes = {
    record: PropTypes.object.isRequired,
    setRecordDate: PropTypes.func.isRequired,
    onSyncedChange: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.onStartTimeChange = this.onStartTimeChange.bind(this);
    this.onEndTimeChange = this.onEndTimeChange.bind(this);
  }

  onStartTimeChange (time) {

    const { record } = this.props;

    const startTime = moment(record.startTime);
    const endTime = moment(record.endTime);

    const vals = time.split(':');

    startTime.set('hours', vals[0]);
    startTime.set('minute', vals[1]);
    startTime.set('second', vals[2]);

    this.onChange({ startTime, endTime });
  }

  onEndTimeChange (time) {
    const { record } = this.props;

    const startTime = moment(record.startTime);
    const endTime = moment(record.endTime);

    const vals = time.split(':');

    endTime.set('hours', vals[0]);
    endTime.set('minute', vals[1]);
    endTime.set('second', vals[2]);

    this.onChange({ startTime, endTime });
  }

  onChange ({ startTime, endTime }) {
    const recordInfo = {
      cuid: this.props.record.cuid,
      startTime: startTime.toDate(),
      endTime: endTime.toDate()
    };

    // Un-synced item. Just update the redux state
    if (!this.isSynced()) {
      this.props.setRecordDate(recordInfo);
    } else {
      this.props.onSyncedChange(recordInfo);
    }
  }

  isSynced () {
    return !!this.props.record.created;
  }

  canBeExported () {
    const { record } = this.props;

    return record.isDirty || (!this.isSynced() && !record.active);
  }

  render () {
    const { record } = this.props;

    const startTime = moment(record.startTime);
    const endTime = moment(record.endTime);
    const elapsedTime = record.elapsedTime || getElapsedTime({ startTime, endTime });

    const startTimeDisplay = (
      <TimeInput
        value={startTime.format('HH:mm:ss')}
        className='date-inp__input date-inp__input--time-seconds'
        onChange={this.onStartTimeChange}
      />
    );

    let endTimeDisplay = endTime.format('HH:mm:ss');
    if (this.isSynced() || !record.active) {
      endTimeDisplay = (
        <TimeInput
          value={endTimeDisplay}
          className='date-inp__input date-inp__input--time-seconds'
          onChange={this.onEndTimeChange}
        />
      );
    }

    let className = 'history-record';
    if (this.canBeExported()) {
      className += ' history-record--can-be-exported';
    }

    return (
      <tr className={className}>
        <td>{record.taskIssueKey}</td>
        <td>{startTimeDisplay}</td>
        <td>{endTimeDisplay}</td>
        <td>{elapsedTime}</td>
        <td>{record.comment}</td>
        <td><img src={ExportIcon} alt='Export' className='history-record history-record-export' /></td>
      </tr>
    );
  }
}
