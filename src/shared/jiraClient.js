import moment from 'moment';

import { setLoggedIn, setUserInfo } from 'store/reducers/profile';
import RecordModel from '../store/models/RecordModel';
import { sendIssueUpdate } from 'shared/websocket';

// Check the session in a few seconds
setTimeout(startupCheck, 2000);

function startupCheck () {
    verifyLoginStatus()
    .then(updateUserInfo);
}

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
        fetch(`/rest/${path}`, {
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
* Verifies the current user session
* @returns void
**/
function verifyLoginStatus () {
    const doLogout = () => {
        logout();

        store.dispatch(setLoggedIn({
            isLoggedIn: false
        }));
    };

    return callApi({
        path: `auth/1/session`
    })
    .then((response) => {

        // Not authenticated. Log out
        if (response.status !== 200) {
            doLogout();
        }

        return response;
    })
    .catch(doLogout);
}

export function updateUserInfo () {
    const state = store.getState();

    userInfo({ username: state.profile.username })
    .then((userinfo) => {
        store.dispatch(setUserInfo({ userinfo }));
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

/*
* get user info
*
*
*/
export function userInfo ({ username }) {
    return new Promise((resolve, reject) => {
        callApi({
            path: `api/2/user?username=${username}`
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

        const getIssue = callApi({
            path: `api/2/issue/${key}`
        });

        const getMeta = callApi({
            path: `api/2/issue/${key}/editmeta`
        });

        Promise.all([
            getIssue,
            getMeta
        ])
        .then(([
            getIssueResponse,
            getMetaResponse
        ]) => {

            getMetaResponse.json().then(json => {

                let epicId = null;

                for (let field in json.fields) {
                    if (json.fields[field].name === 'Epic Link') {
                        epicId = field;
                        break;
                    }
                }

                callApi({
                    path: `api/2/issue/${key}?fields=${epicId}`
                })
                .then(response => {

                    response.json().then(json => {

                        const epicKey = json.fields[epicId];

                        if (epicKey) {

                            callApi({
                                path: `api/2/issue/${epicKey}`
                            })
                            .then(epicResponse => {

                                Promise.all([
                                    getIssueResponse.json(),
                                    epicResponse.json()
                                ])
                                .then(([issueJson, epicJson]) => {
                                    issueJson['epic'] = epicJson

                                    if (getIssueResponse.status === 200) {
                                        return resolve(issueJson);
                                    } else if (getIssueResponse.status === 500) {
                                        verifyLoginStatus();
                                    }

                                    reject(getIssueResponse.status);
                                })

                            });

                        } else {

                            if (getIssueResponse.status === 200) {
                                return resolve(getIssueResponse.json());
                            } else if (getIssueResponse.status === 500) {
                                verifyLoginStatus();
                            }

                            reject(getIssueResponse.status);

                        }

                    });

                });

            });

        })
        .catch(reject);
    })
    .then(issue => sendIssueUpdate(issue));
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

    let { comment, startTime, endTime } = record;

    startTime = moment(startTime);
    endTime = moment(endTime);

    let timeSpentSeconds = endTime.diff(startTime, 'seconds');

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
            resolve(response);
            break;
        }

        // No permission to log here
        case 403 :
        case 500 : {
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
* Updates synced work log
* @param record: RecordModel
* @returns promise
**/
export function updateWorklog ({ record }) {

    let { comment, startTime, endTime, id } = record;

    startTime = moment(startTime);
    endTime = moment(endTime);

    let timeSpentSeconds = endTime.diff(startTime, 'seconds');

    return new Promise((resolve, reject) => {
        callApi({
            path: `api/2/issue/${record.taskIssueKey}/worklog/${id}`,
            method: 'put',
            body: {
                comment,
                timeSpentSeconds,
                started: moment(startTime).format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
            }
        })
    .then(response => {
        switch (response.status) {
        case 200 : {
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

/**
* Get the logs for a given time span
* @param taskIssueKey: string
* @returns promise
**/
export function getWorkLogs ({ startDate, endDate, username }) {

    startDate = moment(startDate);
    endDate = moment(endDate);

    return new Promise((resolve, reject) => {
        let jql = `worklogDate >= "${startDate.format('YYYY-MM-DD')}"` +
            ` and worklogDate <= "${endDate.format('YYYY-MM-DD')}"` +
            ` and worklogAuthor="${username}"`;

        callApi({
            path: `api/2/search?jql=${jql}`
        })
        .then(r => r.json())
        .then((response) => {

            if (response.errorMessages) {
                return reject(response.errorMessages);
            }

            let worklogsGetters = response.issues.map(i => getWorkLogsForIssue({ key: i.key, startDate, username }));

            Promise.all(worklogsGetters)
            .then((worklogs) => {

                let combined = [];

                worklogs.forEach(w => combined.push(...w));

                // Conform all worklogs to our RecordModel
                combined = combined.map((w) => {
                    w.startTime = w.started;
                    return RecordModel(w);
                });

                resolve(combined);
            })
            .catch(reject);
        })
        .catch(reject);
    });
}

/**
* Get a single worklog
* @param key: string
* @param id: string
* @returns promise
**/
export function getWorkLog ({ key, id }) {
    return callApi({
        path: `api/2/issue/${key}/worklog/${id}`
    })
    .then(r => r.json());
}

/**
* Get all worklogs for an issue for a user
* @param key: string
* @param startDate: date
* @param username: string
* @returns promise
**/
function getWorkLogsForIssue ({ key, startDate, username }) {
    return callApi({
        path: `api/2/issue/${key}/worklog`
    })
  .then(r => r.json())
  .then(r => r.worklogs.filter(w => w.author.name === username))
  .then(worklogs => worklogs.filter(w => moment(w.started) >= startDate))
  .then(worklogs => worklogs.map((w) => {
      w.taskIssueKey = key;
      return w;
  }));
}
