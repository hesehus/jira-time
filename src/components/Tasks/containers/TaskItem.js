import { connect } from 'react-redux';
import { removeTask } from '../modules/tasks';
import { startRecording, getRecordsForTask } from '../../Recorder/modules/recorder';

import TaskItem from '../components/TaskItem';

const mapDispatchToProps = {
  removeTask,
  startRecording
};

const mapStateToProps = (state, props) => ({
  records: getRecordsForTask({ state, taskCuid: props.task.cuid })
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskItem);
