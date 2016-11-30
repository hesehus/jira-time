import React, { Component, PropTypes } from 'react'
import './Tabs.scss'

export default class Tabs extends Component {

  static get propTypes () {
    return {
      tabs: PropTypes.array.isRequired,
      activeTab: PropTypes.object.isRequired
    };
  }

  constructor() {

    super();


  }

  render () {
    return (
        <div class="tabs">
            tabs
        </div>
    );
  }
}
