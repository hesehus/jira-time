import { getIssue } from './jiraClient';

export function getJIRAIssueFromUrl (url = '') {
    return new Promise((resolve) => {

        const key = extractIssueIdFromUrl(url);

        if (!key) {
            resolve();
        }

        return getIssue({ key });
    });
}

export function extractIssueIdFromUrl (url) {
    const match = url.match(/[a-zA-Z]+[-][0-9]+/g);
    if (!match || match.length === 0) {
        return;
    }
    return match[0];
}

export function ensureDate (date) {
    if (date instanceof Date) {
        return date;
    }
    return new Date(date);
}
