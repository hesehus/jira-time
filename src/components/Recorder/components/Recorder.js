import React, { Component, PropTypes } from 'react'
import { getIssue, addCurrentUserAsWatcher } from '../../../shared/jiraClient';
import RecordModel from '../modules/RecordModel';

import { Notification } from 'react-notification';

import './Recorder.scss';

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

    this.state = {};

    this.onDrop = this.onDrop.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onStart = this.onStart.bind(this);
    this.updateElapsedTime = this.updateElapsedTime.bind(this);
    this.onCommentChange = this.onCommentChange.bind(this);
  }

  componentWillMount () {
    if (!this.state.binded) {
      this.setState({ binded: true, test: 1 });

      window.__events.on('drop', this.onDrop);

      this.elapsedTimeInterval = setInterval(this.updateElapsedTime, 1000);
    }
  }

  componentWillUnmount () {
    window.__events.off('drop', this.onDrop);
    clearInterval(this.elapsedTimeInterval);
  }

  onDrop ({ url }) {
    if (this.props.isLoggedIn) {

      this.setState({
        addingTaskFromUrl: true
      });

      getIssue({ url })
        .then((issue) => {

          this.setState({
            addingTaskFromUrl: false
          });

          if (issue) {
            this.props.addTask({ issue });

            addCurrentUserAsWatcher({ taskIssueKey: issue.key });

          } else {
            alert(`Hey, this is not a valid JIRA URL.\nPull yourself together!`);
          }
        });
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
    const { task } = this.props.recorder;

    this.props.startRecording({
      task,
      record: RecordModel({ task })
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

    const { task, record } = this.props.recorder;

    // eslint-disable
    // <button onClick={this.onPause} className='recorder-button recorder-button--pause'>Pause</button>;
    const btnStop = <button onClick={this.onStop} className='recorder-button recorder-button--stop'>■</button>;
    // <button onClick={this.onStart} className='recorder-button recorder-button--start'>●</button>;
    // eslint-enable

    const comment = (
      <textarea
        className='recorder-comment'
        value={record ? record.comment : null}
        onChange={this.onCommentChange} />
    );

    let notifications;
    if (this.state.addingTaskFromUrl) {
      const options = {
        isActive: true,
        dismissAfter: 999999,
        message: `Yo, hold on. I'm busy trying to add your task`
      };
      notifications = (
        <Notification
          isActive={options.isActive}
          dismissAfter={options.dismissAfter}
          message={options.message}
        />
      );
    }

    return (
      <div className='recorder recorder--show'>
        {notifications}
        <div className='recorder-left'>
          <div className='recorder-issue-info'>
            {record && task && task.issue ? <div className='recorder-issue-key'>{task.issue.key}</div> : null}
            <div className='recorder-elapsed-time'>{record ? record.elapsed : null}</div>
          </div>
          {record ? comment : null}
        </div>
        <div className='recorder-buttons'>
          {record ? btnStop : null}
        </div>
      </div>
    )
  }
}
