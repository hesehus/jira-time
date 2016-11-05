import React, { Component, PropTypes } from 'react'
import { getIssue } from '../../../shared/jiraClient';
import RecordModel from '../modules/RecordModel';

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
      isLoggedIn: PropTypes.bool
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
      getIssue({ url })
        .then((issue) => {

          if (issue) {
            this.props.addTask({ issue });
          } else {
            alert(`Hey, this is not a valid JIRA URL.\nPull yourself together!`);
          }
        });
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

    if (!task) {
      return (<div className='recorder' />);
    }

    const btnPause = <button onClick={this.onPause} className='recorder-button recorder-button--pause'>Pause</button>;
    const btnStop = <button onClick={this.onStop} className='recorder-button recorder-button--stop'>Stop</button>;
    const btnStart = <button onClick={this.onStart} className='recorder-button recorder-button--start'>Start</button>;
    const comment = (
      <textarea
        className='recorder-comment'
        value={record ? record.comment : null}
        onChange={this.onCommentChange} />
    );

    return (
      <div className='recorder recorder--show'>
        <div className='recorder-left'>
          <div className='recorder-issue-key'>{task.issue.key}</div>
          {record ? comment : null}
        </div>
        <div className='recorder-buttons'>
          {!record ? btnStart : null}
          {record ? btnPause : null}
          {btnStop}
        </div>
        <div className='recorder-elapsed-time'>{record ? record.elapsed : null}</div>
      </div>
    )
  }
}
