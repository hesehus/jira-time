import { connect } from 'react-redux';

import {
  setRecordSync,
  removeRecord,
  setRecordDate,
  setRecordMoving,
  setRecordComment,
  setRecordMoveTarget,
  setRecordTask,
  getActiveRecord,
  getMovingRecord
} from 'store/reducers/recorder';

import RecordItem from '../components/RecordItem';

const mapStateToProps = (state, props) => {
  return {
    activeRecord: getActiveRecord({ state }),
    movingRecord: getMovingRecord({ state })
  };
}

const mapDispatchToProps = {
  setRecordSync,
  removeRecord,
  setRecordDate,
  setRecordMoving,
  setRecordComment,
  setRecordTask,
  setRecordMoveTarget
};

export default connect(mapStateToProps, mapDispatchToProps)(RecordItem);
