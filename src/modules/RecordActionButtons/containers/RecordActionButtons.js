import { connect } from 'react-redux';

import {
  addRecord,
  startRecording,
  getNumberOfRecords
} from 'store/reducers/recorder';

import {
  removeTask,
  refreshIssue,
  setIssueRefreshing
} from 'store/reducers/tasks';

import RecordActionButtons from '../components/RecordActionButtons';

const mapStateToProps = (state, props) => {
    return {
        numberOfRecords: props.task ? getNumberOfRecords({ state, taskCuid: props.task.cuid }) : 0
    }
};

const mapDispatchToProps = {
    startRecording,
    addRecord,
    removeTask,
    refreshIssue,
    setIssueRefreshing
};

export default connect(mapStateToProps, mapDispatchToProps)(RecordActionButtons);
