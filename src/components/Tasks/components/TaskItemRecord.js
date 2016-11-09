import React, { Component, PropTypes } from 'react';

import moment from 'moment';

import './TaskItemRecord.scss';

export class TaskItemRecord extends Component {

  static propTypes = {
    record: PropTypes.object.isRequired,
    recordCuid: PropTypes.string.isRequired,
    removeRecord: PropTypes.func.isRequired,
    setRecordDate: PropTypes.func.isRequired,
    setRecordComment: PropTypes.func.isRequired,
    activeRecord: PropTypes.object
  }

  constructor (props) {
    super(props);

    this.onStartTimeChange = this.onStartTimeChange.bind(this);
    this.onEndTimeChange = this.onEndTimeChange.bind(this);
    this.onRemoveClick = this.onRemoveClick.bind(this);
    this.onCommentChange = this.onCommentChange.bind(this);
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

  onCommentChange (e) {
    this.props.setRecordComment({
      cuid: this.props.record.cuid,
      comment: e.target.value
    });
  }

  onRemoveClick () {
    this.props.removeRecord({ cuid: this.props.record.cuid });
  }

  render () {

    const { record } = this.props;

    let endTimeDisplay;
    if (record.endTime && record.endTime < record.startTime || (record.elapsedTime && record.elapsedTime[0] === '-')) {
      endTimeDisplay = <span>Dude, negative time? <br />You are not <i>that</i> fast.</span>;
    } else {
      endTimeDisplay = <span className='task-item-record__elapsed-time'>{record.elapsedTime}</span>;
    }

    let className = 'task-item-record';
    if (record.syncing) {
      className += ' task-item-record--syncing';
    }
    if (this.props.activeRecord && this.props.activeRecord.cuid === record.cuid) {
      className += ' task-item-record--active';
    }

    return (
      <div className={className}>
        <button className='task-item-record-remove' onClick={this.onRemoveClick} disabled={record.syncing}>x</button>
        <div className='task-item-record-time'>
          <div className='task-item-record-dates'>
            <DateInput date={record.startTime} type='start' onChange={this.onStartTimeChange} />
            {record.endTime ? <DateInput date={record.endTime} type='end' onChange={this.onEndTimeChange} /> : null}
          </div>
          {endTimeDisplay}
        </div>
        <textarea
          className='task-item-record-comment'
          onChange={this.onCommentChange}
          value={record.comment} />
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
    this.onTodayClick = this.onTodayClick.bind(this);

    this.state = {};
  }

  onChange () {

    let date;

    if (this.refs.date) {
      date = new Date(this.refs.date.value + ' ' + this.refs.time.value);
    } else {
      date = new Date(this.props.date);

      const vals = this.refs.time.value.split(':');
      date.setHours(vals[0]);
      date.setMinutes(vals[1]);
    }

    // Always start at first second, for convenience.
    // We are not displaying the seconds in the UI anyway
    date.setSeconds(0);

    this.props.onChange({
      date
    });
  }

  onTodayClick () {
    this.setState({
      showDate: true
    });
  }

  render () {

    const className = `task-item-record-date task-item-record-date--${this.props.type}`;

    const dateObject = moment(this.props.date);

    const date = dateObject.format('YYYY-MM-DD');
    const time = dateObject.format('HH:mm');

    const dateDisplay = (
      <input type='date'
        ref='date'
        defaultValue={date}
        onChange={this.onChange}
        className='task-item-record-date__input task-item-record-date__input--date'
       />
    );
    const timeDisplay = (
      <input type='time'
        ref='time'
        defaultValue={time}
        onChange={this.onChange}
        className='task-item-record-date__input task-item-record-date__input--time'
       />
    );

    let isToday = moment().isSame(dateObject, 'day');
    let today = <span className='task-item-record-date__today' onClick={this.onTodayClick}>Today</span>;

    return (
      <span className={className}>
        {isToday && !this.state.showDate ? today : dateDisplay}
        {timeDisplay}
      </span>
    );
  }
}

export default TaskItemRecord;
