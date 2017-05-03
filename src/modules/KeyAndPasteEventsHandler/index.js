import keycode from 'keycode';

import Sync from 'shared/sync';
import { showAddIssuesDialog } from 'shared/helpers';

let eventsBinded;

export function init () {
    if (!eventsBinded) {

        eventsBinded = true;

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
            if (targetIsNotEditable(e.target)) {
                if (e.clipboardData && e.clipboardData.getData) {
                    const text = e.clipboardData.getData('text/plain');
                    if (text) {
                        window.__events.emit('paste', { text });
                    }
                }
            }
        });

        document.addEventListener('keydown', function onKeyUp (e) {
            const code = keycode(e);

            if (code === 'a' && !e.ctrlKey) {
                if (targetIsNotEditable(e.target)) {
                    showAddIssuesDialog();
                }
            }

            if (e.ctrlKey) {
                if (code === 's') {
                    e.preventDefault();
                    Sync.processAllInState();
                }
            }
        }, false);
    }
}

function targetIsNotEditable (element) {
    const { nodeName } = element;
    return nodeName !== 'INPUT' && nodeName !== 'TEXTAREA';
}

export default {
    init
};
