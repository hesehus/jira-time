import { connect } from 'react-redux';

import {
  startRecording,
  stopRecording,
  setRecordComment,
  updateRecordElapsed
} from 'store/reducers/recorder';

import { addTask } from 'store/reducers/tasks';
import { setSyncId } from 'store/reducers/app';

import Recorder from '../components/Recorder';

const mapDispatchToProps = {
    addTask,
    stopRecording,
    startRecording,
    setRecordComment,
    updateRecordElapsed,
    setSyncId
};

const mapStateToProps = (state) => ({
    tasks : state.tasks.tasks,
    recorder: state.recorder,
    profile: state.profile
});

export default connect(mapStateToProps, mapDispatchToProps)(Recorder);
