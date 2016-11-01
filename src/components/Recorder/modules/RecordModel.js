import cuid from 'cuid';

export default function RecordModel ({ task }) {
  const model = {
    cuid: cuid(),
    taskCuid: task.cuid,
    taskIssueKey: task.issue.key,
    startTime: Date.now(),
    endTime: null,
    comment: 'Jira Time test worklog',
    syncing: false
  };

  return model;
}
