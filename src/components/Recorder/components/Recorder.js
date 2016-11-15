import React, { Component, PropTypes } from 'react'
import { Notification } from 'react-notification';

import { extractIssueKeysFromText, addCurrentUserAsWatcher } from 'shared/jiraClient';
import RecordModel from '../modules/RecordModel';
import ProcessTask from './ProcessTask';

import './Recorder.scss';

const processTask = new ProcessTask();

export default class Recorder extends Component {

  static get propTypes () {
    return {
      addTask: PropTypes.func.isRequired,
      startRecording: PropTypes.func.isRequired,
      stopRecording: PropTypes.func.isRequired,
      pauseRecording: PropTypes.func.isRequired,
      recorder: PropTypes.object.isRequired,
      setRecordComment: PropTypes.func.isRequired,
      updateRecordElapsed: PropTypes.func.isRequired,
      isLoggedIn: PropTypes.bool.isRequired
    };
  }

  constructor (props) {
    super(props);

    this.state = {
      addingTasksFromDropOrPaste: processTask.getRemaining()
    };

    this.onDropAndPaste = this.onDropAndPaste.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onStart = this.onStart.bind(this);
    this.updateElapsedTime = this.updateElapsedTime.bind(this);
    this.onCommentChange = this.onCommentChange.bind(this);

    processTask.on('add', (result) => {
      this.setState({
        addingTasksFromDropOrPaste: processTask.getRemaining()
      });

      if (result.success) {
        this.props.addTask({ issue: result.issue });
        addCurrentUserAsWatcher({ taskIssueKey: result.issue.key });
      }
    });
  }

  componentWillMount () {
    if (!this.state.binded) {
      this.setState({ binded: true, test: 1 });

      window.__events.on('drop', this.onDropAndPaste);
      window.__events.on('paste', this.onDropAndPaste);

      this.elapsedTimeInterval = setInterval(this.updateElapsedTime, 1000);
    }
  }

  componentWillUnmount () {
    window.__events.off('drop', this.onDropAndPaste);
    window.__events.off('paste', this.onDropAndPaste);
    clearInterval(this.elapsedTimeInterval);
  }

  onDropAndPaste ({ url, text }) {
    if (this.props.isLoggedIn) {

      const taskKeys = extractIssueKeysFromText(url || text);

      if (!!taskKeys.length) {

        processTask.add(taskKeys);

        this.setState({
          addingTasksFromDropOrPaste: processTask.getRemaining()
        });
      }
    } else {
      alert(`Hey dude, you are not logged in.
How do you expect me to verify that this URL you dropped is even valid??`);
    }
  }

  onPause () {
    this.props.pauseRecording();
  }

  onStop () {
    this.props.stopRecording();
  }

  onStart () {
    this.props.startRecording({
      record: RecordModel()
    });
  }

  onCommentChange (e) {
    const { record } = this.props.recorder;

    if (record) {
      this.props.setRecordComment({
        cuid: record.cuid,
        comment: e.target.value
      });
    }
  }

  updateElapsedTime () {
    const { record } = this.props.recorder;

    if (record) {
      this.props.updateRecordElapsed({
        cuid: record.cuid
      });
    }
  }

  render () {

    if (!this.props.isLoggedIn) {
      return null;
    }

    const { record } = this.props.recorder;

    // eslint-disable
    // <button onClick={this.onPause} className='recorder-button recorder-button--pause'>Pause</button>;
    const btnStop = <button onClick={this.onStop} className='recorder-button recorder-button--stop'>■</button>;
    const btnStart = <button onClick={this.onStart} className='recorder-button recorder-button--start'>●</button>;
    // eslint-enable

    const comment = (
      <textarea
        className='recorder-comment'
        value={record ? record.comment : null}
        onChange={this.onCommentChange} />
    );

    let notifications;
    const num = this.state.addingTasksFromDropOrPaste;
    if (num) {
      const options = {
        isActive: true,
        dismissAfter: 999999,
        message: `Yo, hold on. I'm real busy trying to add ${num} ${num > 1 ? 'tasks' : 'task'}`
      };
      notifications = (
        <Notification
          isActive={options.isActive}
          dismissAfter={options.dismissAfter}
          message={options.message}
        />
      );
    }

    let issueInfoDisplay;
    if (record) {
      if (record.taskIssueKey) {
        issueInfoDisplay = <div className='recorder-issue-info'>{record.taskIssueKey}</div>;
      } else {
        issueInfoDisplay = <div className='recorder-issue-info'>No issue key? Really? Not cool dude.</div>;
      }
    }

    return (
      <div className='recorder recorder--show'>
        {notifications}
        <div className='recorder-left'>
          <div className='recorder-issue-info'>
            {issueInfoDisplay}
            <div className='recorder-elapsed-time'>{record ? record.elapsedTime : null}</div>
          </div>
          {record ? comment : null}
        </div>
        <div className='recorder-buttons'>
          {record ? btnStop : null}
          {btnStart}
        </div>
      </div>
    )
  }
}


