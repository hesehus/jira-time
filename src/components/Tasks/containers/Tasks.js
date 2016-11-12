import { connect } from 'react-redux';

import {
  getMovingRecord,
  getRecordsWithNoIssue
} from 'components/Recorder/modules/recorder';

import Tasks from '../components/Tasks';

const mapDispatchToProps = {};

const mapStateToProps = (state) => ({
  tasks: state.tasks.tasks,
  movingRecord: getMovingRecord({ state }),
  recordsWithNoIssue: getRecordsWithNoIssue({ state })
});

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
