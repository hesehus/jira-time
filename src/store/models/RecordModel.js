import generateCuid from 'cuid';

import { getElapsedTime } from 'store/reducers/recorder';

export default function RecordModel ({
  cuid = generateCuid(),
  task,
  startTime = Date.now(),
  endTime,
  elapsedTime
} = {}) {
  const model = {
    cuid,
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
