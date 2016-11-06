import moment from 'moment';
import { ensureDate } from './helpers';

/**
* Wrapper for all API calls
**/
function callApi ({ path, method = 'get', body }) {

  const state = window.store.getState();

  const headers = {
    'Content-Type': 'application/json'
  };

  if (state.app.authenticationHash) {
    headers['Authorization'] = `Basic ${state.app.authenticationHash}`;
  }

  return fetch(`${state.app.api}/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  })
  .then((response) => {

    if (!response) {
      throw new Error('No response received from API');
    }

    switch (response.status) {
      case 500 : {
        throw new Error(response);
      }
      default : {
        return response;
      }
    }
  })
  .catch((error) => {
    console.error(error);
  });
}

/**
* Login
* @param username: string
* @param password: string
* @returns promise
**/
export function login ({ username, password }) {
  return callApi({
    path: 'auth/1/session',
    method: 'post',
    body: {
      username,
      password
    }
  })
  .then((response) => {

    if (!response) {
      return {
        success: false,
        type: 'noResponseFromAPI'
      };
    }

    if (response.status === 401) {
      return {
        success: false,
        type: 'invalidCredentials'
      };
    }

    if (response.status === 403) {
      return {
        success: false,
        type: 'tooManyFailedLoginAttempts'
      };
    }

    return {
      success: true
    };
  });
}

/**
* Get issue
* @param id: string
* @param url: string
* @returns promise
**/
export function getIssue ({ id, url }) {

  if (!id && url) {
    id = extractIssueIdFromUrl(url);
  }

  if (!id) {
    return Promise.reject(`Did not find a valid JIRA id in the given url ${url}`);
  }

  return callApi({
    path: `api/2/issue/${id}`
  })
  .then(response => response.json());
}

function extractIssueIdFromUrl (url) {
  const match = url.match(/[a-zA-Z]+[-][0-9]+/g);
  if (!match || match.length === 0) {
    return;
  }
  return match[0];
}

/**
* Logs work to an issue
* @param record: RecordModel
* @returns promise
**/
export function addWorklog ({ record }) {

  const { comment, startTime, endTime } = record;

  let timeSpentSeconds = Math.floor((ensureDate(endTime) - ensureDate(startTime)) / 1000);
  if (timeSpentSeconds < 60) {
    timeSpentSeconds = 60;
  }

  return callApi({
    path: `api/2/issue/${record.taskIssueKey}/worklog`,
    method: 'post',
    body: {
      comment,
      timeSpentSeconds,
      started: moment(startTime).format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
    }
  })
  .catch(err => console.error(err));
}
