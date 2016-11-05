import { connect } from 'react-redux';

import {
  startRecording,
  stopRecording,
  pauseRecording,
  setRecordComment,
  updateRecordElapsed
} from '../modules/recorder';

import { addTask } from '../../Tasks/modules/tasks';

import Recorder from '../components/Recorder';

const mapDispatchToProps = {
  addTask,
  stopRecording,
  startRecording,
  pauseRecording,
  setRecordComment,
  updateRecordElapsed
};

const mapStateToProps = (state) => ({
  tasks : state.tasks.tasks,
  recorder: state.recorder,
  isLoggedIn: state.profile.loggedIn
});

export default connect(mapStateToProps, mapDispatchToProps)(Recorder);
