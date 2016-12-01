import { connect } from 'react-redux';

import UITabs from '../components/Tabs';

import { addTab, addTabTask } from 'store/reducers/tabs';

const mapStateToProps = (state) => ({
  tabs: state.tabs
});

const mapDispatchToProps = {
    addTab,
    addTabTask
};

export default connect(mapStateToProps, mapDispatchToProps)(UITabs);
