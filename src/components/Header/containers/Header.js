import { connect } from 'react-redux';

import { getCurrentPath } from '../../../store/location';
import { getRecords, setRecordSync, removeRecord } from '../../Recorder/modules/recorder';
import { refreshIssue } from '../../Tasks/modules/tasks';

import Header from '../components/Header';

const mapDispatchToProps = {
  setRecordSync,
  removeRecord,
  refreshIssue
};

const mapStateToProps = (state) => ({
  records: getRecords(state),
  currentPath: getCurrentPath(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
