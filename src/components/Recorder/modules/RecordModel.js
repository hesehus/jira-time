import Elapsed from 'elapsed';
import cuid from 'cuid';

export default function RecordModel ({ task, startTime = Date.now(), endTime, elapsedTime }) {
  const model = {
    cuid: cuid(),
    taskCuid: task ? task.cuid : null,
    taskIssueKey: task ? task.issue.key : null,
    startTime,
    elapsedTime,
    endTime,
    comment: '',
    syncing: false
  };
  
  if (startTime && endTime && !elapsedTime) {
    model.elapsedTime = new Elapsed(startTime, endTime).optimal;
  }

  return model;
}
