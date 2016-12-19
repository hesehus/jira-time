import React, { Component, PropTypes } from 'react';
import { hashHistory, Router } from 'react-router';
import { Provider, connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { default as swal } from 'sweetalert2'

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
        const { nodeName } = e.target;
        if (nodeName !== 'INPUT' && nodeName !== 'TEXTAREA') {
          if (e.clipboardData && e.clipboardData.getData) {
            const text = e.clipboardData.getData('text/plain');
            if (text) {
              window.__events.emit('paste', { text });
            }
          }
        }
      });

      document.addEventListener('keydown', function onKeyUp (e) {
        // 65 === 'a'
        if (e.keyCode === 65 && e.altKey) {
          swal({
            title: 'Add issue',
            text: 'Throw some issue keys at me man!',
            input: 'text'
          })
          .then(text => {
            if (text) {
              window.__events.emit('paste', { text });
            }
          });
        }
      }, false);

    }
  }

  shouldComponentUpdate () {
    return false;
  }

  render () {
    const { routes, store } = this.props

    return (
      <Provider store={store}>
        <MuiThemeProvider>
          <Router history={hashHistory} children={routes} />
        </MuiThemeProvider>
      </Provider>
    )
  }
}

export default connect()(AppContainer);
