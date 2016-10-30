import React, { Component, PropTypes } from 'react'
import { getIssue } from '../../../shared/jiraClient';
import RecordModel from '../modules/RecordModel';
import Elapsed from 'elapsed';

import './Recorder.scss';

export default class Recorder extends Component {

  static get propTypes () {
    return {
      addTask: PropTypes.func.isRequired,
      startRecording: PropTypes.func.isRequired,
      stopRecording: PropTypes.func.isRequired,
      pauseRecording: PropTypes.func.isRequired,
      recorder: PropTypes.object.isRequired
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
    getIssue({ url })
      .then((issue) => {
        
        if (issue) {
          this.props.addTask({ issue });
        } else {
          alert(`Hey, this is not a valid JIRA URL.\nPull yourself together!`);
        }
      });
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
      record: new RecordModel({ task })
    });
  }

  updateElapsedTime () {
    const { record } = this.props.recorder;

    if (!record) {
      return this.setState({
        elapsedTime: ''
      });
    }

    const elapsedTime = new Elapsed(record.startTime, Date.now());

    this.setState({
      elapsedTime: elapsedTime.optimal
    });
  }

  render () {

    const { task, record } = this.props.recorder;

    if (!task) {
      return (<div className='recorder'></div>);
    }

    return (
      <div className='recorder recorder--show'>
        <div className='recorder-issue-key'>{task.issue.key}</div>
        <div className='recorder-buttons'>
          {record ? <button  onClick={this.onPause} className='recorder-button recorder-button--pause'>Pause</button> : null}
          {record ? <button  onClick={this.onStop} className='recorder-button recorder-button--stop'>Stop</button> : null}
          {!record ? <button onClick={this.onStart} className='recorder-button recorder-button--start'>Start</button> : null}
        </div>
        <div className='recorder-elapsed-time'>{this.state.elapsedTime}</div>
      </div>
    )
  }
}
