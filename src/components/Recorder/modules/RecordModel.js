import cuid from 'cuid';

export default function RecordModel ({ task, startTime = Date.now(), endTime }) {
  const model = {
    cuid: cuid(),
    taskCuid: task ? task.cuid : null,
    taskIssueKey: task ? task.issue.key : null,
    startTime,
    elapsedTime: null,
    endTime,
    comment: '',
    syncing: false
  };

  return model;
}
