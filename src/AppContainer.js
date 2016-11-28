import React, { Component, PropTypes } from 'react';
import { hashHistory, Router } from 'react-router';
import { Provider, connect } from 'react-redux';

class AppContainer extends Component {
  static propTypes = {
    routes  : PropTypes.object.isRequired,
    store   : PropTypes.object.isRequired
  }

  componentWillMount () {
    if (!window.__mainEventsBinded) {

      window.__mainEventsBinded = true;

      ['drag',
        'dragend',
        'dragenter',
        'dragexit',
        'dragleave',
        'dragover',
        'dragstart',
        'drop'].forEach(name => document.addEventListener(name, e => e.preventDefault(), false));

      document.addEventListener('drop', function onDrop (event) {
        const url = event.dataTransfer.getData('URL');
        const text = event.dataTransfer.getData('Text');

        window.__events.emit('drop', { url, text });
      }, false);

      document.addEventListener('paste', function onPaste (e) {
        if (e.target.type !== 'input' && e.target.type !== 'textarea') {
          if (e.clipboardData && e.clipboardData.getData) {
            const text = e.clipboardData.getData('text/plain');
            if (text) {
              window.__events.emit('paste', { text });
            }
          }
        }
      });

    }
  }

  shouldComponentUpdate () {
    return false;
  }

  render () {
    const { routes, store } = this.props

    return (
      <Provider store={store}>
        <Router history={hashHistory} children={routes} />
      </Provider>
    )
  }
}

export default connect()(AppContainer);
