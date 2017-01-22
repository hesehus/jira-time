import Hammer from 'hammerjs';
import keycode from 'keycode';
import domClosest from 'dom-closest';

import events from 'shared/events';
import {
    setRecordTask,
    setRecordMoving,
    getMovingRecord,
    setRecordMoveTarget
} from 'store/reducers/recorder';

let eventsBinded;
let taskElement;
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
            direction: Hammer.DIRECTION_VERTICAL,
            threshold: 5
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

function onPanStart (event) {
    if (event.target.type !== 'textarea' && event.target.type !== 'input') {
        recordElement = domClosest(event.target, '.record');
        if (recordElement) {
            doSharedMovingPreparations();

            store.dispatch(setRecordMoving({
                cuid: recordElement.dataset.cuid,
                moving: true
            }));

            onPanMove(event);
            return;
        }

        taskElement = domClosest(event.target, '.task-item');
        if (taskElement) {
            doSharedMovingPreparations();

            return events.emit('panstart:task', {
                event,
                element: taskElement
            });
        }
    }

    function doSharedMovingPreparations () {
        event.preventDefault();
        clearSelection();
        document.body.classList.add('moving');
    }
}

function onPanMove (event) {
    if (recordElement) {
        const record = getMovingRecord({ state: store.getState() });
        if (record) {
            event.preventDefault();

            recordElement.style.transform = `translate3d(0px, ${event.deltaY + 60}px, 0) scale(1.01)`;

            const target = document.elementFromPoint(event.center.x, event.center.y);
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
        return;
    }

    if (taskElement) {
        event.preventDefault();
        return events.emit('panmove:task', {
            event,
            element: taskElement
        });
    }
}

function onPanEnd (e) {
    if (recordElement) {
        const record = getMovingRecord({ state: store.getState() });
        if (record) {
            store.dispatch(setRecordTask({
                cuid: record.cuid,
                taskCuid: targetTaskCuid,
                taskIssueKey: targetTaskIssueKey
            }));

            e.preventDefault();
            panCleanup();
            return;
        }
    }

    if (taskElement) {
        e.preventDefault();
        panCleanup();
        return events.emit('panend:task', e);
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
    if (recordElement) {
        events.emit('pancancel:record');

        targetTaskCuid = null;
        recordElement = null;

        const record = getMovingRecord({ state: store.getState() });
        if (record) {
            store.dispatch(setRecordMoving({
                cuid: record.cuid,
                moving: false
            }));
        }
    } else if (taskElement) {
        events.emit('pancancel:task');

        taskElement = null;
    }

    panCleanup();
    clearSelection();
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
