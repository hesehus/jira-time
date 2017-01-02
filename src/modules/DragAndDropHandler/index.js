import Hammer from 'hammerjs';
import keycode from 'keycode';
import domClosest from 'dom-closest';

import {
    setRecordTask,
    setRecordMoving,
    getMovingRecord,
    setRecordMoveTarget
} from 'store/reducers/recorder';

let eventsBinded;
let recordElement;
let targetTaskCuid;
let targetTaskIssueKey;

export function init () {
    if (!eventsBinded) {

        eventsBinded = true;

        const mc = new Hammer.Manager(document, {
            cssProps: {
                userSelect: 'text'
            }
        });

        mc.add(new Hammer.Pan({
            direction: Hammer.DIRECTION_VERTICAL
        }));

        mc.on('panstart', onPanStart);
        mc.on('panmove', onPanMove);
        mc.on('panend', onPanEnd);

        document.addEventListener('keydown', onKeyPress, false);
    }
}

function onKeyPress (e) {
    if (keycode(e) === 'esc') {
        cancelPan();
    }
}

function onPanStart (e) {
    if (e.target.type !== 'textarea' && e.target.type !== 'input') {

        recordElement = domClosest(e.target, '.record');
        if (recordElement) {
            e.preventDefault();

            clearSelection();

            document.body.classList.add('moving');

            store.dispatch(setRecordMoving({
                cuid: recordElement.dataset.cuid,
                moving: true
            }));

            onPanMove(e);
        }
    }
}

function onPanMove (e) {
    const record = getMovingRecord({ state: store.getState() });
    if (record && recordElement) {
        e.preventDefault();

        recordElement.style.transform = `translate3d(0px, ${e.deltaY + 60}px, 0) scale(1.01)`;

        const target = document.elementFromPoint(e.center.x, e.center.y);
        const closestTask = domClosest(target, '.task-item');

        let taskCuid;
        let taskIssueKey;

        if (closestTask) {
            taskCuid = closestTask.dataset.cuid;
            taskIssueKey = closestTask.dataset.taskissuekey;
        }

        if (targetTaskCuid !== taskCuid) {
            targetTaskCuid = taskCuid;
            targetTaskIssueKey = taskIssueKey;

            store.dispatch(setRecordMoveTarget({
                cuid: record.cuid,
                taskCuid
            }));
        }
    }
}

function onPanEnd (e) {
    const record = getMovingRecord({ state: store.getState() });
    if (record) {
        store.dispatch(setRecordTask({
            cuid: record.cuid,
            taskCuid: targetTaskCuid,
            taskIssueKey: targetTaskIssueKey
        }));

        panCleanup();
    }
}

function panCleanup () {
    clearSelection();
    document.body.classList.remove('moving');

    if (recordElement) {
        recordElement.style.transform = ``;
    }
}

function cancelPan () {
    panCleanup();
    
    targetTaskCuid = null;
    recordElement = null;

    const record = getMovingRecord({ state: store.getState() });
    if (record) {
        store.dispatch(setRecordMoving({
            cuid: record.cuid,
            moving: false
        }));
    }
}

// Clears any HTML text selection on the page
function clearSelection () {
    if (document.selection) {
        document.selection.empty();
    } else if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
}

export default {
    init
};
