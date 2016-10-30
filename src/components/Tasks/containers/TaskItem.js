import { connect } from 'react-redux';
import { removeTask } from '../modules/tasks';
import { startRecording } from '../../Recorder/modules/recorder';

import TaskItem from '../components/TaskItem';

const mapDispatchToProps = {
  removeTask,
  startRecording
};

const mapStateToProps = (state) => ({
  records: state.recorder.records
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskItem);
