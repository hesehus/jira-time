import { connect } from 'react-redux';

import { getActiveRecord, getRecordsForTask } from 'store/reducers/recorder';

import Records from '../components/Records';

const mapStateToProps = (state, { taskCuid }) => {
  return {
    records: getRecordsForTask({ state, taskCuid }),
    activeRecord: getActiveRecord({ state })
  };
}

export default connect(mapStateToProps)(Records);
