import { connect } from 'react-redux';

import HistoryRecordItem from '../components/HistoryRecordItem';

import { setRecordDate } from 'store/reducers/recorder';

// const mapStateToProps = () => {};

const mapDispatchToProps = {
  setRecordDate
};

export default connect(undefined, mapDispatchToProps)(HistoryRecordItem);