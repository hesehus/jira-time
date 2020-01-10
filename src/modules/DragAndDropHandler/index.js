import Hammer from 'hammerjs';
import keycode from 'keycode';
import domClosest from 'dom-closest';

import events from 'shared/events';
import { setRecordTask, setRecordMoving, getMovingRecord, setRecordMoveTarget } from 'store/reducers/recorder';

import { getTasksFilteredBySearch, dropTaskAfterTarget } from 'store/reducers/tasks';

let eventsBinded;
let taskElement;
let taskElementClone;
let recordElement;
let recordElementClone;
let recordElementHeight;
let targetTaskCuid;
let targetTaskIssueKey;
let tasksFilteredBySearch = [];

export function init() {
    if (!eventsBinded) {
        eventsBinded = true;

        const mc = new Hammer.Manager(document, {
            cssProps: {
                userSelect: 'text'
            }
        });

        mc.add(
            new Hammer.Pan({
                direction: Hammer.DIRECTION_ALL,
                threshold: 5
            })
        );

        mc.on('panstart', onPanStart);
        mc.on('panmove', onPanMove);
        mc.on('panend', onPanEnd);

        document.addEventListener('keydown', onKeyPress, false);
    }
}

// Determine the closest task when a mouseY value is given
export function getClosestTaskFromPosition({ x, y }) {
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
        task: tasksFilteredBySearch[index],
        taskElement
    };
}

function onKeyPress(e) {
    if (keycode(e) === 'esc') {
        cancelPan();
    }
}

function onPanStart(event) {
    if (event.target.type !== 'textarea' && event.target.type !== 'input' && event.target.contentEditable !== 'true') {
        tasksFilteredBySearch = getTasksFilteredBySearch({ state: store.getState() });

        recordElement = domClosest(event.target, '.record');

        if (recordElement) {
            doSharedMovingPreparations();

            store.dispatch(
                setRecordMoving({
                    cuid: recordElement.dataset.cuid,
                    moving: true
                })
            );

            const rect = recordElement.getBoundingClientRect();
            recordElementHeight = rect.height;

            const container = domClosest(recordElement, '.tasks');
            const rectContainer = container.getBoundingClientRect();
            recordElementClone = recordElement.cloneNode(true);
            recordElementClone.style.position = 'absolute';
            recordElementClone.style.top = rect.top - rectContainer.top + 'px';
            recordElementClone.style.left = rect.left + 'px';
            recordElementClone.style.height = rect.height + 'px';
            recordElementClone.style.width = rect.width + 'px';
            recordElementClone.style.pointerEvents = 'none';
            container.appendChild(recordElementClone);

            recordElement.style.opacity = 0;

            onPanMove(event);
            return;
        }

        const tasksAreFiltered = !!store.getState().tasks.search;
        if (!tasksAreFiltered) {
            taskElement = domClosest(event.target, '.task');
            if (taskElement) {
                doSharedMovingPreparations();

                const rect = taskElement.getBoundingClientRect();

                const container = domClosest(taskElement, '.tasks');
                const rectContainer = container.getBoundingClientRect();
                taskElementClone = taskElement.cloneNode(true);
                taskElementClone.style.position = 'absolute';
                taskElementClone.style.top = rect.top - rectContainer.top + 'px';
                taskElementClone.style.left = rect.left + 'px';
                taskElementClone.style.height = rect.height + 'px';
                taskElementClone.style.width = rect.width + 'px';
                taskElementClone.style.pointerEvents = 'none';
                container.appendChild(taskElementClone);

                taskElement.style.opacity = 0;
                taskElement.style.height = 0;
                taskElement.style.padding = 0;
                taskElement.style.margin = 0;

                onPanMove(event);
            }
        }
    }

    function doSharedMovingPreparations() {
        event.preventDefault();
        clearSelection();
        document.body.classList.add('moving');
    }
}

function onPanMove(event) {
    if (recordElement) {
        const record = getMovingRecord({ state: store.getState() });
        if (record) {
            event.preventDefault();

            recordElementClone.style.transform = `translate3d(${event.deltaX}px, ${event.deltaY}px, 0) scale(1.05)`;

            const { x, y } = event.center;
            const closestTask = getClosestTaskFromPosition({ x, y });

            if (!closestTask.task) {
                targetTaskCuid = null;
                targetTaskIssueKey = null;
            } else {
                targetTaskCuid = closestTask.task.cuid;
                targetTaskIssueKey = closestTask.task.issue.key;
            }

            if (record.taskDroppableCuid !== targetTaskCuid) {
                store.dispatch(
                    setRecordMoveTarget({
                        cuid: record.cuid,
                        taskCuid: targetTaskCuid
                    })
                );
            }
        }
        return;
    }

    if (taskElement) {
        event.preventDefault();
        const taskCuid = taskElement.dataset.cuid;
        taskElementClone.style.transform = `translate3d(${event.deltaX}px, ${event.deltaY}px, 0) scale(1.05)`;

        const { x, y } = event.center;
        const closestTask = getClosestTaskFromPosition({ x, y });

        const container = domClosest(taskElement, '.tasks');
        const tasks = container.querySelectorAll('.task');
        tasks.forEach(elem => {
            elem.classList.remove('task--drop-target');
        });

        let newTargetTaskCuid;
        let newTargetTaskIssueKey;

        if (!closestTask.task) {
            newTargetTaskCuid = null;
            newTargetTaskIssueKey = null;
        } else {
            newTargetTaskCuid = closestTask.task.cuid;
            newTargetTaskIssueKey = closestTask.task.issue.key;
        }

        if (closestTask.taskElement && taskCuid !== newTargetTaskCuid) {
            closestTask.taskElement.classList.add('task--drop-target');
        }

        targetTaskCuid = newTargetTaskCuid;
        targetTaskIssueKey = newTargetTaskIssueKey;
    }
}

function onPanEnd(e) {
    if (recordElement) {
        const record = getMovingRecord({ state: store.getState() });
        if (record) {
            store.dispatch(
                setRecordTask({
                    cuid: record.cuid,
                    taskCuid: targetTaskCuid,
                    taskIssueKey: targetTaskIssueKey
                })
            );

            e.preventDefault();
            panCleanup();
            recordElement = null;
            return;
        }
    }

    if (taskElement) {
        e.preventDefault();

        store.dispatch(
            dropTaskAfterTarget({
                cuid: taskElement.dataset.cuid,
                targetTaskCuid
            })
        );

        panCleanup();
        taskElement = null;
    }
    targetTaskCuid = null;
}

function panCleanup() {
    clearSelection();
    document.body.classList.remove('moving');

    if (recordElement) {
        recordElement.style.transform = ``;
        recordElement.style.opacity = 1;
    }
    if (recordElementClone) {
        recordElementClone.remove();
    }
    if (taskElement) {
        taskElement.style.transform = ``;
        taskElement.style.opacity = 1;
        taskElement.style.height = '';
        taskElement.style.padding = '';
        taskElement.style.margin = '';
        const container = domClosest(taskElement, '.tasks');
        const tasks = container.querySelectorAll('.task');
        tasks.forEach(elem => {
            elem.classList.remove('task--drop-target');
        });
    }
    if (taskElementClone) {
        taskElementClone.remove();
    }
}

function cancelPan() {
    panCleanup();
    clearSelection();
    if (recordElement) {
        events.emit('pancancel:record');

        targetTaskCuid = null;
        recordElement = null;

        const record = getMovingRecord({ state: store.getState() });
        if (record) {
            store.dispatch(
                setRecordMoving({
                    cuid: record.cuid,
                    moving: false
                })
            );
        }
    } else if (taskElement) {
        // events.emit('pancancel:task');
        taskElement = null;
        targetTaskCuid = null;
    }
}

// Clears any HTML text selection on the page
function clearSelection() {
    if (document.selection) {
        document.selection.empty();
    } else if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
}

export default {
    init
};
