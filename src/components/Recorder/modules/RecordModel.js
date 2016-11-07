import cuid from 'cuid';

export default function RecordModel ({ task, startTime = Date.now(), endTime }) {
  const model = {
    cuid: cuid(),
    taskCuid: task.cuid,
    taskIssueKey: task.issue.key,
    startTime,
    elapsedTime: null,
    endTime,
    comment: '',
    syncing: false
  };

  return model;
}
