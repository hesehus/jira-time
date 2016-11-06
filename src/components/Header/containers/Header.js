import { connect } from 'react-redux';

import { getCurrentPath } from '../../../store/location';
import { getRecords, setRecordSync, removeRecord } from '../../Recorder/modules/recorder';
import { refreshIssue, setIssueRefreshing } from '../../Tasks/modules/tasks';

import Header from '../components/Header';

const mapDispatchToProps = {
  setRecordSync,
  removeRecord,
  refreshIssue,
  setIssueRefreshing
};

const mapStateToProps = (state) => ({
  records: getRecords(state),
  currentPath: getCurrentPath(state),
  loggedIn: state.profile.loggedIn
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
