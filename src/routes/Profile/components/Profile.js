import React, { Component } from 'react'

import './Profile.scss';

export class Profile extends Component {

  constructor (props) {
    super(props);

    this.onLoginButtonClick = this.onLoginButtonClick.bind(this);
  }

  onLoginButtonClick () {
    this.doLogin();
  }

  doLogin () {
    alert('todo');
    /* const headers = new Headers();

    // const authHash = 'aGFrb25oazpQb3N0bWFubnBhdDE=';

    fetch(`http://localhost:8080/rest/api/2/issue/TEST-11`, {
      method: 'GET',
      headers: headers,
      mode: 'no-cors',
      cache: 'default'
    })
    .then(response => {
      debugger;
      //return response.blob();
    }); */
  }

  render () {
    return (
      <div className='profile'>
        <button onClick={this.onLoginButtonClick}>Login</button>
      </div>
    );
  }
}

export default Profile;
