import React, { Component, PropTypes } from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider, connect } from 'react-redux'
import stopDrops from './drop';
import { actions as tasksActions } from '../routes/Tasks/modules/tasks';
import { isValidJiraURL } from '../shared/urlHelper';

class AppContainer extends Component {
  static propTypes = {
    routes  : PropTypes.object.isRequired,
    store   : PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.state = {};
  }

  componentWillMount () {
    if (!this.state.binded) {
      this.setState({ binded: true });

      stopDrops();
      document.addEventListener('drop', this.onDrop.bind(this), false);

      navigator.serviceWorker.controller.onstatechange = function serviceWorkerStateChanged () {
        console.log('SW CHANGED');
      }
    }
  }

  onDrop (event) {
    const url = event.dataTransfer.getData('URL');

    if (isValidJiraURL(url)) {
      this.props.dispatch(tasksActions.addTaskFromUrl(url));
    } else {
      alert(`Hey, this is not a valid JIRA URL.
Pull yourself together!`);
    }
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { routes, store } = this.props

    return (
      <Provider store={store}>
        <div style={{ height: '100vm', width: '100vw' }}>
          <Router history={browserHistory} children={routes} />
        </div>
      </Provider>
    )
  }
}

function mapStateToProps (state) {
  return {};
}

export default connect(mapStateToProps)(AppContainer);
