import React from 'react';
import ReactDOM from 'react-dom';
import EventClass from './shared/eventClass';

import createStore from './store/createStore';
import AppContainer from './AppContainer';

// Register global event class instance
window.__events = new EventClass();

// ========================================================
// Store Instantiation
// ========================================================
const store = createStore();

// Bleed store to the window, so we are able to access it when using API calls
window.store = store;

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');

let render = () => {
    const routes = require('./pages/index').default(store);

    ReactDOM.render(
        <AppContainer store={store} routes={routes} />,
    MOUNT_NODE
  );
};

// This code is excluded from production bundle
if (__DEV__) {
    if (module.hot) {

    // Development render functions
        const renderApp = render;
        const renderError = (error) => {
            const RedBox = require('redbox-react').default;

            ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
        };

    // Wrap render in try/catch
        render = () => {
            try {
                renderApp();
            } catch (error) {
                renderError(error);
            }
        }

    // Setup hot module replacement
        module.hot.accept('./pages/index', () =>
      setImmediate(() => {
          ReactDOM.unmountComponentAtNode(MOUNT_NODE);
          render();
      })
    );
    }
}

// ========================================================
// Go!
// ========================================================
render();
