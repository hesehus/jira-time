import React, { Component, PropTypes } from 'react';
import Elapsed from 'elapsed';
import moment from 'moment';

import './TaskItemRecord.scss';

export class TaskItemRecord extends Component {

  static propTypes = {
    record: PropTypes.object.isRequired,
    recordCuid: PropTypes.string.isRequired,
    removeRecord: PropTypes.func.isRequired,
    setRecordDate: PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props);

    this.onStartTimeChange = this.onStartTimeChange.bind(this);
    this.onEndTimeChange = this.onEndTimeChange.bind(this);
    this.onRemoveClick = this.onRemoveClick.bind(this);
  }

  onStartTimeChange ({ date }) {
    this.props.setRecordDate({
      cuid: this.props.record.cuid,
      startTime: date,
      endTime: this.props.record.endTime
    });
  }

  onEndTimeChange ({ date }) {
    this.props.setRecordDate({
      cuid: this.props.record.cuid,
      startTime: this.props.record.startTime,
      endTime: date
    });
  }

  onRemoveClick () {
    this.props.removeRecord({ cuid: this.props.record.cuid });
  }

  render () {

    const { record } = this.props;

    const elapsedTime = record.endTime ? new Elapsed(record.startTime, record.endTime).optimal : null;

    const className = record.syncing ? 'task-item-record task-item-record--syncing' : 'task-item-record';

    let endTimeDisplay;
    if (record.endTime) {
      if (record.endTime < record.startTime) {
        endTimeDisplay = 'Dude, negative time? You are not so fast.';
      } else {
        endTimeDisplay = (<span className='task-item-record__elapsed-time'>{elapsedTime}</span>);
      }
    }

    return (
      <div className={className}>
        <button className='task-item-record-remove' onClick={this.onRemoveClick}>x</button>
        <DateInput date={record.startTime} type='start' onChange={this.onStartTimeChange} />
        {record.endTime ? <DateInput date={record.endTime} type='end' onChange={this.onEndTimeChange} /> : null}
        {endTimeDisplay}
      </div>
    );
  }
}

class DateInput extends Component {

  static propTypes = {
    type: PropTypes.string.isRequired,
    date: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange () {
    this.props.onChange({
      date: new Date(this.refs.date.value + ' ' + this.refs.time.value)
    });
  }

  render () {

    const className = `task-item-record-date task-item-record-date--${this.props.type}`;

    const dateObject = moment(this.props.date);
    
    const date = dateObject.format('YYYY-MM-DD');
    const time = dateObject.format('HH:mm');

    const datetime = dateObject.format('YYYY-MM-DD HH:mm');

    // const isToday = dateIsToday(dateObject);

    return (
      <span className={className}>
        <input type='date' ref='date' value={date} onChange={this.onChange} className='task-item-record-date__input task-item-record-date__input--date' />
        <input type='time' ref='time' value={time} onChange={this.onChange} className='task-item-record-date__input task-item-record-date__input--time' />
      </span>
    );
  }
}

function dateIsToday (date) {
  const today = new Date();

  return
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate();
}

export default TaskItemRecord;
