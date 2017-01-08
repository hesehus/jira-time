import { connect } from 'react-redux';

import {
  addRecord,
  startRecording
} from 'store/reducers/recorder';

import RecordActionButtons from '../components/RecordActionButtons';

const mapDispatchToProps = {
    startRecording,
    addRecord
};

export default connect(null, mapDispatchToProps)(RecordActionButtons);
