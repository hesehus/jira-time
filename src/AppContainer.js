import React, { Component, PropTypes } from 'react';
import { hashHistory, Router } from 'react-router';
import { Provider, connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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

      let altDown = false;
      document.addEventListener('keydown', function onKeyUp (e) {
        if (e.keyCode === 18) {
          altDown = true;
        }

        // 65 === 'a'
        if (e.keyCode === 65 && altDown) {
          altDown = false;
          const text = prompt(`Throw some issue keys at me man!`);
          if (text) {
            window.__events.emit('paste', { text });
          }
        }
      }, false);
      document.addEventListener('keyup', function onKeyUp (e) {

        if (e.keyCode === 18) {
          altDown = false;
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
