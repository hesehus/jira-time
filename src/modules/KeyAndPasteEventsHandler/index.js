import React, { Component, PropTypes } from 'react';
import { default as swal } from 'sweetalert2'

import Sync from 'shared/sync';

export default class KeyAndPasteEventsHandler extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired
  }

  componentWillMount () {
    if (!window.__keyAndPasteEventsBinded) {

      window.__keyAndPasteEventsBinded = true;

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
        if (e.altKey) {
                    // 65 === 'a'
          if (e.keyCode === 65) {
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
        }

        if (e.ctrlKey) {
          let charCode = e.keyCode || e.which;
          let charStr = String.fromCharCode(charCode);
          if (charStr === 'S') {
            Sync.processAllInState();
          }
        }
      }, false);
    }
  }

  shouldComponentUpdate () {
    return false;
  }

  render ({ children }) {
    return <div>{children}</div>;
  }
}
