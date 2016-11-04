import  { connect } from 'react-redux';

import { removeRecord, setRecordDate, setRecordComment, getRecord } from '../../Recorder/modules/recorder';

import TaskItemRecord from '../components/TaskItemRecord';

const mapStateToProps = (state, props) => {
  return {
    record2: getRecord({ state, recordCuid: props.recordCuid })
  };
}

const mapDispatchToProps = {
  removeRecord,
  setRecordDate,
  setRecordComment
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskItemRecord);
