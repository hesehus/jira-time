import { connect } from 'react-redux';

import {
  getRecordsWithNoIssue
} from 'store/reducers/recorder';

import Tasks from '../components/Tasks';

const mapStateToProps = (state) => ({
  tasks: state.tasks.tasks,
  recordsWithNoIssue: getRecordsWithNoIssue({ state })
});

export default connect(mapStateToProps)(Tasks);
