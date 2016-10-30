import { connect } from 'react-redux';

import Tasks from '../components/Tasks';

const mapDispatchToProps = {};

const mapStateToProps = (state) => ({
  tasks: state.tasks.tasks
});

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
