import generateCuid from 'cuid';
import moment from 'moment';

import { getElapsedTime } from 'store/reducers/recorder';

export default function RecordModel ({
  cuid = generateCuid(),
  task,
  taskIssueKey,
  startTime = Date.now(),
  endTime,
  elapsedTime,
  comment = '',
  timeSpentSeconds = 0,
  created,
  updated,
  id
} = {}) {

  const model = {
    cuid,
    taskCuid: task ? task.cuid : null,
    taskIssueKey: task ? task.issue.key : taskIssueKey || null,
    taskDroppableCuid: null,
    moving: false,
    startTime,
    endTime,
    elapsedTime,
    comment,
    syncing: false,
    id, // Jiras worklog id
    created, // Jiras created worklog time (When it was synced the first time)
    updated // Jiras updated worklog time
  };

  if (!model.endTime && timeSpentSeconds) {
    model.endTime = moment(model.startTime).add(timeSpentSeconds, 'seconds').toDate();
  }

  if (startTime && endTime && !elapsedTime) {
    model.elapsedTime = getElapsedTime({ startTime, endTime });
  }

  return model;
}
