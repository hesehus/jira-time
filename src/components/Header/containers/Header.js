import { connect } from 'react-redux';

import { getCurrentPath } from '../../../store/location';
import { thereAreRecords } from '../../Recorder/modules/recorder';

import Header from '../components/Header';

const mapDispatchToProps = {};

const mapStateToProps = (state) => ({
  thereAreRecords: thereAreRecords(state),
  currentPath: getCurrentPath(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
