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
let recordElementInitialCenterPosition;
let targetTaskCuid;
let targetTaskIssueKey;
let tasksPositions = [];
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

        events.on('tasksPositionsCalculated', p => tasksPositions = p.tasksPositions);
    }
}

// Determine the closest task when a mouseY value is given
export function getClosestTaskFromPosition ({ y }) {
    let index = 0;
    let diff;
    for (let i = 0; i < tasksPositions.length; i++) {
        const rect = tasksPositions[i];
        const diffForThisTask = Math.abs(y - rect.center);
        if (i === 0 || diffForThisTask < diff) {
            index = i;
            diff = diffForThisTask;
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
    if (event.target.type !== 'textarea' && event.target.type !== 'input') {

        tasksFilteredBySearch = getTasksFilteredBySearch({ state: store.getState() });

        recordElement = domClosest(event.target, '.record');
        if (recordElement) {
            if (!!tasksPositions.length) {
                doSharedMovingPreparations();

                store.dispatch(setRecordMoving({
                    cuid: recordElement.dataset.cuid,
                    moving: true
                }));

                // Get the distance from the mouse center, to the record center
                const rect = recordElement.getBoundingClientRect();
                recordElementInitialCenterPosition = rect.top + (rect.height / 2);

                onPanMove(event);
            }
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

            recordElement.style.transform = `translate3d(0px, ${event.deltaY}px, 0) scale(1.08)`;

            const y = (recordElementInitialCenterPosition + event.deltaY) - tasksPositions[0].clientRect.top;

            if (y > 20) {
                const closestTask = getClosestTaskFromPosition({ y });

                targetTaskCuid = closestTask.task.cuid;
                targetTaskIssueKey = closestTask.task.issue.key;
            } else {
                targetTaskCuid = null;
                targetTaskIssueKey = null
            }

            store.dispatch(setRecordMoveTarget({
                cuid: record.cuid,
                taskCuid: targetTaskCuid
            }));
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
