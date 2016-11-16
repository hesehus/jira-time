import moment from 'moment';
import { ensureDate } from './helpers';

import { setLoggedIn } from 'routes/Profile/modules/profile';

// Check the session in a few seconds
setTimeout(verifyLoginStatus, 5000);

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
  
  return new Promise((resolve, reject) => {
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
          break;
        }

        // Not found or not permissions to call this API action
        case 404 : {
          reject(response);
          break;
        }

        default : {
          resolve(response);
          break;
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
export function login ({ username, password } = {}) {
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
* Verifies the current user session
* @returns void
**/
function verifyLoginStatus () {
  callApi({
    path: `auth/1/session`
  })
  .then((response) => {

    // Not authenticated. Log out
    if (response.status === 403) {
      logout();

      store.dispatch(setLoggedIn({
        isLoggedIn: false
      }));
    }
  });
}

/**
* Logs out user
* @returns void
**/
export function logout () {
  callApi({
    path: 'auth/1/session',
    method: 'delete'
  });
}

/**
* Get issue
* @param id: string
* @param url: string
* @returns promise
**/
export function getIssue ({ key, url }) {

  if (!key && url) {
    key = extractIssueKeysFromText(url)[0];

    if (!key) {
      return Promise.reject(`Did not find a valid JIRA key in the given url ${url}`);
    }
  }

  if (!key) {
    return Promise.reject(`No valid key passed for getIssue`);
  }

  return new Promise((resolve, reject) => {
    callApi({
      path: `api/2/issue/${key}`
    })
    .then((response) => {

      if (response.status === 200) {
        return resolve(response.json());
      }

      reject(response.status);
    })
    .catch(reject);
  });
}

/**
* Extracts Jira issue keys from a text
* @param text: string
* @returns array
**/
export function extractIssueKeysFromText (text) {
  const matches = text.match(/[a-zA-Z]+[-][0-9]+/g);
  if (!matches) {
    return [];
  }
  return matches;
}

/**
* Logs work to an issue
* @param record: RecordModel
* @returns promise
**/
export function addWorklog ({ record }) {

  const { comment, startTime, endTime } = record;

  let timeSpentSeconds = Math.floor((ensureDate(endTime) - ensureDate(startTime)) / 1000);

  return new Promise((resolve, reject) => {
    callApi({
      path: `api/2/issue/${record.taskIssueKey}/worklog`,
      method: 'post',
      body: {
        comment,
        timeSpentSeconds,
        started: moment(startTime).format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
      }
    })
    .then(response => {
      switch (response.status) {
        case 201 : {
          resolve();
          break;
        }

        // No permission to log here
        case 403 : {
          reject(response);
          verifyLoginStatus();
          break;
        }

        default : {
          reject(response);
        }
      }
    })
    .catch(reject);
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
