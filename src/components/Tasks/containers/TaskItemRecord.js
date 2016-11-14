import { connect } from 'react-redux';

import {
  removeRecord,
  setRecordDate,
  setRecordMoving,
  setRecordComment,
  setRecordMoveTarget,
  setRecordTask,
  getActiveRecord,
  getMovingRecord
} from '../../Recorder/modules/recorder';

import TaskItemRecord from '../components/TaskItemRecord';

const mapStateToProps = (state, props) => {
  return {
    activeRecord: getActiveRecord({ state }),
    movingRecord: getMovingRecord({ state })
  };
}

const mapDispatchToProps = {
  removeRecord,
  setRecordDate,
  setRecordMoving,
  setRecordComment,
  setRecordTask,
  setRecordMoveTarget
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskItemRecord);
