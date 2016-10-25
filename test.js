var fetch = require('node-fetch');
var btoa = require('btoa');

// if you are on node v0.10, set a Promise library first, eg.
// fetch.Promise = require('bluebird');

// plain text or html

//fetch('http://localhost:8080/rest/auth/1/session', {
/*fetch('https://jira.hesehus.dk/rest/auth/1/session', {
  method: 'POST',
  //body: 'username=hakonhk,password=Postmannpat1'
  body: JSON.stringify({ username: 'hk', password: 'Jsii90rx1r4' }),
  headers: { 'Content-Type': 'application/json' }
})
  .then(function(res) {
      //console.log(res.status + ' ' + res.statusText);
      console.log(res);
  });
*/
fetch('https://jira.hesehus.dk/rest/api/2/issue/MATASS-1383', {
  method: 'GET',
  headers: {
    //'Accept': 'application/json',
    //'Content-Type': 'application/json',
    //'Origin': '',
    'Authorization': 'Basic '+ btoa(unescape(encodeURIComponent('hk:Jsii90rx1r4')))
  }
})
.then(function(res) {
    console.log(res);
});