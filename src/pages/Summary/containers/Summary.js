import { connect } from 'react-redux';

import Summary from '../components/Summary';

const mapStateToProps = (state) => ({
    profile : state.profile,
    notSyncedRecords: state.recorder.records,
    activeRecord: state.recorder.record
});

export default connect(mapStateToProps)(Summary);
