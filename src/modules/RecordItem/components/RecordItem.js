import React, { Component, PropTypes } from 'react';

import Hammer from 'hammerjs';
import domClosest from 'dom-closest';

import Sync from 'shared/sync';
import DateInput from 'modules/DateInput';

import ExportIcon from 'assets/export.svg';
import LoadingIcon from 'assets/loading.svg';

import './RecordItem.scss';

// Clears any HTML text selection on the page
function clearSelection () {
  if (document.selection) {
    document.selection.empty();
  } else if (window.getSelection) {
    window.getSelection().removeAllRanges();
  }
}

export default class RecordItem extends Component {

  static propTypes = {
    record: PropTypes.object.isRequired,
    recordCuid: PropTypes.string.isRequired,
    setRecordSync: PropTypes.func.isRequired,
    removeRecord: PropTypes.func.isRequired,
    setRecordDate: PropTypes.func.isRequired,
    setRecordComment: PropTypes.func.isRequired,
    setRecordMoving: PropTypes.func.isRequired,
    setRecordMoveTarget: PropTypes.func.isRequired,
    setRecordTask: PropTypes.func.isRequired,
    activeRecord: PropTypes.object,
    movingRecord: PropTypes.object,
    autofocus: PropTypes.bool
  }

  constructor (props) {
    super(props);

    this.onStartTimeChange = this.onStartTimeChange.bind(this);
    this.onEndTimeChange = this.onEndTimeChange.bind(this);
    this.onRemoveClick = this.onRemoveClick.bind(this);
    this.onCommentChange = this.onCommentChange.bind(this);
    this.onSyncClick = this.onSyncClick.bind(this);

    this.onKeyPress = this.onKeyPress.bind(this);

    this.state = {
      comment: ''
    };
  }

  componentWillMount () {
    this.setState({
      comment: this.props.record.comment
    });
  }

  componentDidMount () {
    this.bind();
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.record) {
      if (nextProps.record.comment !== this.state.comment) {
        this.setState({
          comment: nextProps.record.comment
        });
      }
    }
  }

  componentDidUpdate () {
    this.bind();
  }

  bind () {
    if (this.outer && !this.outer.isBinded) {
      this.outer.isBinded = true;

      this.mc = new Hammer.Manager(this.outer, {
        cssProps: {
          userSelect: 'text'
        }
      });

      this.mc.add(new Hammer.Pan({
        direction: Hammer.DIRECTION_VERTICAL
      }));

      this.mc.on('panstart', e => this.onPanStart(e));
      this.mc.on('panmove', e => this.onPanMove(e));
      this.mc.on('panend', e => this.onPanEnd(e));

      document.addEventListener('keydown', this.onKeyPress, false);

      if (this.inputComment && this.props.autofocus) {
        this.inputComment.select();
        this.inputComment.scrollIntoViewIfNeeded ? this.inputComment.scrollIntoViewIfNeeded() : this.scrollIntoView();
      }
    }
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', e => this.onKeyPress(e));
  }

  onKeyPress (e) {

    // ESC
    if (e.keyCode === 27) {
      this.cancelPan();
    }
  }

  onPanStart (e) {
    if (e.target.type !== 'textarea' && e.target.type !== 'input') {
      e.preventDefault();

      clearSelection();

      document.body.classList.add('moving');

      this.props.setRecordMoving({
        cuid: this.props.record.cuid,
        moving: true
      });

      this.onPanMove(e);
    }
  }

  onPanMove (e) {
    if (this.props.record.moving) {
      e.preventDefault();

      const { record } = this.props;

      e.target.style.top = `${e.center.y + 20}px`;

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

    this.setState({
      comment: e.target.value
    });

    this.props.setRecordComment({
      cuid: this.props.record.cuid,
      comment: e.target.value
    });
  }

  onRemoveClick () {
    this.props.removeRecord({ cuid: this.props.record.cuid });
  }

  onSyncClick () {
    const syncer = new Sync({
      records: [this.props.record],
      setRecordSync: this.props.setRecordSync,
      removeRecord: this.props.removeRecord
    });

    syncer.start();
  }

  render () {

    let { record, movingRecord } = this.props;

    const someRecordIsMoving = !!movingRecord;

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

    let btnSync;
    if (record.syncing) {
      btnSync = (
        <div className='record__sync record__sync--syncing' title='Syncing!'>
          <img className='record__sync-icon' src={LoadingIcon} alt='Loading' />
        </div>
      );
    } else {
      btnSync = (
        <div className='record__sync' onClick={this.onSyncClick} title='Sync this worklog to JIRA'>
          <img className='record__sync-icon' src={ExportIcon} alt='Export' />
        </div>
      );
    }

    return (
      <div className={className} ref={(i) => this.outer = i}>
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
          <span className='record__elapsed-time'>{record.elapsedTime}</span>
        </div>
        <textarea
          className='record-comment'
          onChange={this.onCommentChange}
          value={this.state.comment}
          disabled={someRecordIsMoving}
          ref={(i) => this.inputComment = i}
        />
        {btnSync}
      </div>
    );
  }
}
