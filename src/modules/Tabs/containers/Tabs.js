import { connect } from 'react-redux';

import UITabs from '../components/Tabs';

const mapStateToProps = (state) => ({
  tabs: [],
  activeTab: {}
});

export default connect(mapStateToProps)(UITabs);
