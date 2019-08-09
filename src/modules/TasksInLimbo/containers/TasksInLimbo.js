import { connect } from 'react-redux';

import { getMovingRecord, getRecordsWithNoIssue } from 'store/reducers/recorder';

import TasksinLimbo from '../components/TasksinLimbo';

const mapStateToProps = state => ({
    movingRecord: getMovingRecord({ state }),
    recordsWithNoIssue: getRecordsWithNoIssue({ state })
});

export default connect(mapStateToProps)(TasksinLimbo);
