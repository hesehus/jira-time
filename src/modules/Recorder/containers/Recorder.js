import { connect } from 'react-redux';

import {
  startRecording,
  stopRecording,
  setRecordComment,
  updateRecordElapsed
} from 'store/reducers/recorder';

import { addTask } from 'store/reducers/tasks';

import Recorder from '../components/Recorder';

const mapDispatchToProps = {
  addTask,
  stopRecording,
  startRecording,
  setRecordComment,
  updateRecordElapsed
};

const mapStateToProps = (state) => ({
  tasks : state.tasks.tasks,
  recorder: state.recorder,
  isLoggedIn: state.profile.loggedIn
});

export default connect(mapStateToProps, mapDispatchToProps)(Recorder);
