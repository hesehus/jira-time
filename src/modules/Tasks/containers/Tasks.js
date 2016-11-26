import { connect } from 'react-redux';

import {
  getMovingRecord,
  getRecordsWithNoIssue
} from 'store/reducers/recorder';

import Tasks from '../components/Tasks';

const mapDispatchToProps = {};

const mapStateToProps = (state) => ({
  tasks: state.tasks.tasks,
  movingRecord: getMovingRecord({ state }),
  recordsWithNoIssue: getRecordsWithNoIssue({ state })
});

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
