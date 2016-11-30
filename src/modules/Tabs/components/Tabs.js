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

    debugger;

    //chromeTabs = chromeTabs.default

    // Add chrome tabs CSS to page head
    chromeTabs.insertCss()

    // Init chrome tabs in the container .chrome-tabs-shell
    var $chromeTabsExampleShell = $(".chrome-tabs-shell")

    chromeTabs.init({
      $shell: $chromeTabsExampleShell,
      minWidth: 45,
      maxWidth: 180
    })

  }

  render () {
    return (
          <div class="chrome-tabs">
            <div class="chrome-tabs-content">
              <div class="chrome-tab">
                <div class="chrome-tab-background">
                </div>
                <div class="chrome-tab-favicon" style="background-image: url('demo/images/google-favicon.png')"></div>
                <div class="chrome-tab-title">Google</div>
                <div class="chrome-tab-close"></div>
              </div>
              <div class="chrome-tab chrome-tab-current">
                <div class="chrome-tab-background">
                </div>
                <div class="chrome-tab-favicon" style="background-image: url('demo/images/facebook-favicon.ico')"></div>
                <div class="chrome-tab-title">Facebook</div>
                <div class="chrome-tab-close"></div>
              </div>
            </div>
            <div class="chrome-tabs-bottom-bar"></div>
          </div>

    );
  }
}
