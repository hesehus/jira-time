import React, { Component, PropTypes } from 'react';

import Hammer from 'hammerjs';
import moment from 'moment';
import domClosest from 'dom-closest';

import './TaskItemRecord.scss';

// Clears any HTML text selection on the page
function clearSelection () {
  if (document.selection) {
    document.selection.empty();
  } else if (window.getSelection) {
    window.getSelection().removeAllRanges();
  }
}

export class TaskItemRecord extends Component {

  static propTypes = {
    record: PropTypes.object.isRequired,
    recordCuid: PropTypes.string.isRequired,
    removeRecord: PropTypes.func.isRequired,
    setRecordDate: PropTypes.func.isRequired,
    setRecordComment: PropTypes.func.isRequired,
    setRecordMoving: PropTypes.func.isRequired,
    setRecordMoveTarget: PropTypes.func.isRequired,
    setRecordTask: PropTypes.func.isRequired,
    activeRecord: PropTypes.object,
    movingRecord: PropTypes.object
  }

  constructor (props) {
    super(props);

    this.onStartTimeChange = this.onStartTimeChange.bind(this);
    this.onEndTimeChange = this.onEndTimeChange.bind(this);
    this.onRemoveClick = this.onRemoveClick.bind(this);
    this.onCommentChange = this.onCommentChange.bind(this);

    this.onPanStart = this.onPanStart.bind(this);
    this.onPanMove = this.onPanMove.bind(this);
    this.onPanEnd = this.onPanEnd.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount () {
    if (this.refs.outer) {
      this.mc = new Hammer.Manager(this.refs.outer, {
        cssProps: {
          userSelect: 'text'
        }
      });

      this.mc.add(new Hammer.Pan({
        direction: Hammer.DIRECTION_VERTICAL
      }));

      this.mc.on('panstart', this.onPanStart);
      this.mc.on('panmove', this.onPanMove);
      this.mc.on('panend', this.onPanEnd);
    }

    if (!this.documentListener) {
      document.addEventListener('keydown', this.onKeyPress, false);
      this.documentListener = true;
    }
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.onKeyPress);
  }

  onKeyPress (e) {
    
    // ESC
    if (e.keyCode === 27) {
      this.cancelPan();
    }
  }

  onPanStart (e) {
    e.preventDefault();

    clearSelection();

    document.body.classList.add('moving');

    this.props.setRecordMoving({
      cuid: this.props.record.cuid,
      moving: true
    });

    this.onPanMove(e);
  }

  onPanMove (e) {
    if (this.props.record.moving && this.refs.outer) {
      e.preventDefault();

      const { record } = this.props;

      this.refs.outer.style.top = `${e.center.y + 20}px`;

      const target = document.elementFromPoint(e.center.x, e.center.y);
      const closestTask = domClosest(target, '.task-item');

      let taskCuid;
      let taskIssueKey;

      if (closestTask) {
        taskCuid = closestTask.dataset.cuid;
        taskIssueKey = closestTask.dataset.taskissuekey;
        this.targetIsRecordsWithNoIssue = false;
      } else {
        if (domClosest(target, '.records--no-issue')) {
          this.targetIsRecordsWithNoIssue = true;
        }
      }

      if (this.targetTaskCuid !== taskCuid) {
        this.targetTaskCuid = taskCuid;
        this.targetTaskIssueKey = taskIssueKey;

        this.props.setRecordMoveTarget({
          cuid: record.cuid,
          taskCuid
        });
      }
    }
  }

  onPanEnd (e) {
    if (this.props.record.moving) {
      this.props.setRecordTask({
        cuid: this.props.record.cuid,
        taskCuid: this.targetTaskCuid,
        taskIssueKey: this.targetTaskIssueKey
      });

      this.panCleanup();
    }
  }

  panCleanup () {
    clearSelection();
    document.body.classList.remove('moving');
  }

  cancelPan () {
    this.targetTaskCuid = null;

    this.props.setRecordMoving({
      cuid: this.props.record.cuid,
      moving: false
    });

    this.panCleanup();
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

    const { record, movingRecord } = this.props;

    const someRecordIsMoving = !!movingRecord;

    let endTimeDisplay;
    endTimeDisplay = <span className='task-item-record__elapsed-time'>{record.elapsedTime}</span>;

    let className = 'record';
    if (record.syncing) {
      className += ' record--syncing';
    }
    if (this.props.activeRecord && this.props.activeRecord.cuid === record.cuid) {
      className += ' record--active';
    }
    if (record.moving) {
      className += ' record--moving';
    }

    return (
      <div className={className} ref='outer'>
        <button className='record-remove' onClick={this.onRemoveClick} disabled={record.syncing}>x</button>
        <div className='record-time'>
          <div className='record-dates'>
            <DateInput
              date={record.startTime}
              type='start'
              onChange={this.onStartTimeChange}
              disabled={someRecordIsMoving}
            />
            {record.endTime ? (
              <DateInput
                date={record.endTime}
                type='end'
                onChange={this.onEndTimeChange}
                disabled={someRecordIsMoving}
              />
            ) : (
              null
            )}
          </div>
          {endTimeDisplay}
        </div>
        <textarea
          className='record-comment'
          onChange={this.onCommentChange}
          value={record.comment}
          disabled={someRecordIsMoving}
          autoFocus={focus}
        />
      </div>
    );
  }
}

class DateInput extends Component {

  static propTypes = {
    type: PropTypes.string.isRequired,
    date: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool
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

    const className = `record-date record-date--${this.props.type}`;

    const dateObject = moment(this.props.date);

    const date = dateObject.format('YYYY-MM-DD');
    const time = dateObject.format('HH:mm');

    const dateDisplay = (
      <input type='date'
        ref='date'
        defaultValue={date}
        onChange={this.onChange}
        className='record-date__input record-date__input--date'
        disabled={this.props.disabled}
       />
    );
    const timeDisplay = (
      <input type='time'
        ref='time'
        defaultValue={time}
        onChange={this.onChange}
        className='record-date__input record-date__input--time'
        disabled={this.props.disabled}
       />
    );

    let isToday = moment().isSame(dateObject, 'day');
    let today = <span className='record-date__today' onClick={this.onTodayClick}>Today</span>;

    return (
      <span className={className}>
        {isToday && !this.state.showDate ? today : dateDisplay}
        {timeDisplay}
      </span>
    );
  }
}

export default TaskItemRecord;
