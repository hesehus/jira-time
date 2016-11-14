import cuid from 'cuid';

import { getElapsedTime } from './recorder';

export default function RecordModel ({ task, startTime = Date.now(), endTime, elapsedTime } = {}) {
  const model = {
    cuid: cuid(),
    taskCuid: task ? task.cuid : null,
    taskIssueKey: task ? task.issue.key : null,
    taskDroppableCuid: null,
    moving: false,
    startTime,
    elapsedTime,
    endTime,
    comment: '',
    syncing: false
  };

  if (startTime && endTime && !elapsedTime) {
    model.elapsedTime = getElapsedTime({ startTime, endTime });
  }

  return model;
}
