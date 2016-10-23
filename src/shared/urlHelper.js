export function isValidJiraURL (url = '') {
  if (url.indexOf('://jira') !== -1) {
    return true;
  }

  if (location.hostname === 'localhost') {
    if (url.indexOf('localhost') !== -1) {
      return true;
    }
  }

  return false;
}

export function extractTaskIdFromUrl () {
  return '';
}
