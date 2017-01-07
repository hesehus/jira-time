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
} from 'store/reducers/recorder';

import { getMovingTask } from 'store/reducers/tasks';

import RecordItem from '../components/RecordItem';

const mapStateToProps = (state, props) => {
    return {
        activeRecord: getActiveRecord({ state }),
        movingRecord: getMovingRecord({ state }),
        movingTask: getMovingTask({ state })
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

export default connect(mapStateToProps, mapDispatchToProps)(RecordItem);
