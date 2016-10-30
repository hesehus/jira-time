import { connect } from 'react-redux';
import { startRecording, stopRecording, pauseRecording } from '../modules/recorder';
import { addTask } from '../../Tasks/modules/tasks';

import Recorder from '../components/Recorder';

const mapDispatchToProps = {
  addTask,
  stopRecording,
  startRecording,
  pauseRecording
};

const mapStateToProps = (state) => ({
  tasks : state.tasks.tasks,
  recorder: state.recorder
});

export default connect(mapStateToProps, mapDispatchToProps)(Recorder);
