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

import { getTasksFilteredBySearch } from 'store/reducers/tasks';

let eventsBinded;
let taskElement;
let recordElement;
let recordElementHeight;
let targetTaskCuid;
let targetTaskIssueKey;
let tasksFilteredBySearch = [];

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

// Determine the closest task when a mouseY value is given
export function getClosestTaskFromPosition ({ x, y }) {
    let index = -1;

    const taskElement = domClosest(document.elementFromPoint(x, y), '.task');
    if (taskElement) {
        let taskIndex = tasksFilteredBySearch.findIndex(t => t.cuid === taskElement.dataset.cuid);
        if (taskIndex > -1) {
            index = taskIndex;
        }
    }

    return {
        index,
        task: tasksFilteredBySearch[index]
    };
}

function onKeyPress (e) {
    if (keycode(e) === 'esc') {
        cancelPan();
    }
}

function onPanStart (event) {
    if (event.target.type !== 'textarea' && event.target.type !== 'input' && event.target.contentEditable !== 'true') {

        tasksFilteredBySearch = getTasksFilteredBySearch({ state: store.getState() });

        recordElement = domClosest(event.target, '.record');

        if (recordElement) {
            doSharedMovingPreparations();

            store.dispatch(setRecordMoving({
                cuid: recordElement.dataset.cuid,
                moving: true
            }));

            const rect = recordElement.getBoundingClientRect();
            recordElementHeight = rect.height;

            onPanMove(event);
            return;
        }

        const tasksAreFiltered = !!store.getState().tasks.search;
        if (!tasksAreFiltered) {
            taskElement = domClosest(event.target, '.task');
            if (taskElement) {
                doSharedMovingPreparations();

                return events.emit('panstart:task', {
                    event,
                    element: taskElement
                });
            }
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

            recordElement.style.transform = `translate3d(0px, ${event.deltaY + recordElementHeight}px, 0) scale(1.05)`;

            const { x, y } = event.center;
            const closestTask = getClosestTaskFromPosition({ x, y });

            if (!closestTask.task) {
                targetTaskCuid = null;
                targetTaskIssueKey = null
            } else {
                targetTaskCuid = closestTask.task.cuid;
                targetTaskIssueKey = closestTask.task.issue.key;
            }

            if (record.taskDroppableCuid !== targetTaskCuid) {
                store.dispatch(setRecordMoveTarget({
                    cuid: record.cuid,
                    taskCuid: targetTaskCuid
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

        recordElement.style.transform = ``;
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
