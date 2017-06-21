import { connect } from 'react-redux';

import {
  removeTask,
  refreshIssue,
  setIssueRefreshing,
  setIssueRemainingEstimate,
  getMovingTask
} from 'store/reducers/tasks';

import { getMovingRecord, getRecordsForTask, getRecordsWithNoIssue } from 'store/reducers/recorder';

import Task from '../components/Task';

const mapStateToProps = (state, props) => {
    return {
        movingRecord: getMovingRecord({ state }),
        movingTask: getMovingTask({ state }),
        records: getRecordsForTask({ state, taskCuid: props.task.cuid }),
        numberOfRecordsWithNoIssue: getRecordsWithNoIssue({ state }).length
    }
};

const mapDispatchToProps = {
    removeTask,
    refreshIssue,
    setIssueRefreshing,
    setIssueRemainingEstimate
};

export default connect(mapStateToProps, mapDispatchToProps)(Task);
