import { connect } from 'react-redux';

import {
  addRecord,
  startRecording
} from 'store/reducers/recorder';

import {
  removeTask,
  refreshIssue,
  setIssueRefreshing
} from 'store/reducers/tasks';

import RecordActionButtons from '../components/RecordActionButtons';

const mapDispatchToProps = {
    startRecording,
    addRecord,
    removeTask,
    refreshIssue,
    setIssueRefreshing
};

export default connect(null, mapDispatchToProps)(RecordActionButtons);
