import React, { Component, PropTypes } from 'react';
import { hashHistory, Router } from 'react-router';
import { Provider, connect } from 'react-redux';

import KeyAndPasteEventsHandler from 'modules/KeyAndPasteEventsHandler';

class AppContainer extends Component {
  static propTypes = {
    routes  : PropTypes.object.isRequired,
    store   : PropTypes.object.isRequired
  }

  shouldComponentUpdate () {
    return false;
  }

  render () {
    const { routes, store } = this.props

    return (
      <Provider store={store}>
        <KeyAndPasteEventsHandler>
          <Router history={hashHistory} children={routes} />
        </KeyAndPasteEventsHandler>
      </Provider>
    )
  }
}

export default connect()(AppContainer);
