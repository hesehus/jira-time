import  { connect } from 'react-redux';

import {
  removeRecord,
  setRecordDate,
  setRecordComment,
  getActiveRecord
} from '../../Recorder/modules/recorder';

import TaskItemRecord from '../components/TaskItemRecord';

const mapStateToProps = (state, props) => {
  return {
    activeRecord: getActiveRecord(state)
  };
}

const mapDispatchToProps = {
  removeRecord,
  setRecordDate,
  setRecordComment
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskItemRecord);
