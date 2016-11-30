import React, { Component, PropTypes } from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import Slider from 'material-ui/Slider'
import './Tabs.scss'

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

export default class UITabs extends Component {

  static get propTypes () {
    return {
      tabs: PropTypes.array.isRequired,
      activeTab: PropTypes.object.isRequired
    };
  }

  handleActive(tab) {
    console.log(`A tab with this route property ${tab.props['data-route']} was activated.`);
  }

  render () {
    return (
      <Tabs>
        <Tab label="Item One" >
          <div>
            <h2 style={styles.headline}>Tab One</h2>
            <p>
              This is an example tab.
            </p>
            <p>
              You can put any sort of HTML or react component in here. It even keeps the component state!
            </p>
            <Slider name="slider0" defaultValue={0.5} />
          </div>
        </Tab>
        <Tab label="Item Two" >
          <div>
            <h2 style={styles.headline}>Tab Two</h2>
            <p>
              This is another example tab.
            </p>
          </div>
        </Tab>
        <Tab
          label="onActive"
          data-route="/home"
          onActive={this.handleActive}
        >
          <div>
            <h2 style={styles.headline}>Tab Three</h2>
            <p>
              This is a third example tab.
            </p>
          </div>
        </Tab>
      </Tabs>
    );
  }
}