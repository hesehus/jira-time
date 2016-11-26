import { connect } from 'react-redux';

import {
  removeTask,
  refreshIssue,
  setIssueRefreshing,
  setIssueRemainingEstimate
} from 'store/reducers/tasks';

import {
  addRecord,
  startRecording,
  getMovingRecord,
  getRecordsForTask
} from 'store/reducers/recorder';

import TaskItem from '../components/TaskItem';

const mapStateToProps = (state, props) => ({
  records: getRecordsForTask({ state, taskCuid: props.task.cuid }),
  movingRecord: getMovingRecord({ state })
});

const mapDispatchToProps = {
  removeTask,
  refreshIssue,
  setIssueRefreshing,
  setIssueRemainingEstimate,
  startRecording,
  addRecord
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskItem);
