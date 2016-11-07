import { connect } from 'react-redux';

import {
  removeTask,
  refreshIssue,
  setIssueRefreshing
} from '../modules/tasks';

import {
  addRecord,
  startRecording,
  getRecordsForTask
} from '../../Recorder/modules/recorder';

import TaskItem from '../components/TaskItem';

const mapDispatchToProps = {
  removeTask,
  refreshIssue,
  setIssueRefreshing,
  startRecording,
  addRecord
};

const mapStateToProps = (state, props) => ({
  records: getRecordsForTask({ state, taskCuid: props.task.cuid })
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskItem);
