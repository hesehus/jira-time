import { connect } from 'react-redux';

import Tabs from '../components/Tabs';

const mapStateToProps = (state) => ({
  tabs: [],
  activeTab: {}
});

export default connect(mapStateToProps)(Tabs);
