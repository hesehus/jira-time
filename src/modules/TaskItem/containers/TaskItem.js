import { connect } from 'react-redux';

import {
  removeTask,
  refreshIssue,
  setIssueRefreshing,
  setIssueRemainingEstimate,
  getMovingTask
} from 'store/reducers/tasks';

import { getMovingRecord, getNumberOfRecords } from 'store/reducers/recorder';

import TaskItem from '../components/TaskItem';

const mapStateToProps = (state, props) => ({
    movingRecord: getMovingRecord({ state }),
    movingTask: getMovingTask({ state }),
    numberOfRecords: props.task ? getNumberOfRecords({ state, taskCuid: props.task.cuid }) : 0
});

const mapDispatchToProps = {
    removeTask,
    refreshIssue,
    setIssueRefreshing,
    setIssueRemainingEstimate
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskItem);
