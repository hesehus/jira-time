import { connect } from 'react-redux';

import { getActiveRecord, getNotSyncedRecords } from 'store/reducers/recorder';

import Summary from '../components/Summary';

const mapStateToProps = state => ({
    profile: state.profile,
    notSyncedRecords: getNotSyncedRecords({ state }),
    activeRecord: getActiveRecord({ state })
});

export default connect(mapStateToProps)(Summary);
