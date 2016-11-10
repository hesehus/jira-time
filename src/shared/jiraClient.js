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

  return new Promise((resolve, reject) {
    fetch(`${state.app.api}/${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    })
    .then((response) => {

      if (!response) {
        reject('No response received from API');
      }

      switch (response.status) {
        
        // In case of API error
        case 500 : {
          reject(response);
        }

        // Not found or not permissions to call this API action
        case 404 : {
          reject(response);
        }

        default : {
          resolve(response);
        }
      }
    })
    .catch((error) => {
      reject(error);
    });
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

  return callApi({
    path: `api/2/issue/${record.taskIssueKey}/worklog`,
    method: 'post',
    body: {
      comment,
      timeSpentSeconds,
      started: moment(startTime).format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
    }
  });
}

/**
* Updates the remaining time for an issue
* @param originalEstimate: string
* @param remainingEstimate: string
* @returns promise
**/
export function setIssueRemaining ({ id, originalEstimate, remainingEstimate }) {
  return callApi({
    path: `api/2/issue/${id}`,
    method: 'put',
    body: {
      fields: {
        timetracking: {
          originalEstimate,
          remainingEstimate
        }
      }
    }
  });
}

// 
/**
* Sets the logged in user as watcher for a given issue
* @param taskIssueKey: string
* @returns promise
**/
export function addCurrentUserAsWatcher ({ taskIssueKey }) {
  return callApi({
    path: `api/2/issue/${taskIssueKey}/watchers`,
    method: 'post'
  });
}
