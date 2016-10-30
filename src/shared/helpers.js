import { getIssue } from './jiraClient';

export function getJIRAIssueFromUrl (url = '') {
  return new Promise((resolve, reject) => {

    const id = extractIssueIdFromUrl(url);

    if (!id) {
      resolve();
    }

    return getIssue({ id });
  });
}

export function extractIssueIdFromUrl (url) {
  const match = url.match(/[a-zA-Z]+[-][0-9]+/g);
  if (!match || match.length === 0) {
    return;
  }
  return match[0];
}
