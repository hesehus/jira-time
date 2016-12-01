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

        </Tab>
        <Tab label="Item Two" >

        </Tab>
        <Tab
          label="onActive"
          data-route="/home"
          onActive={this.handleActive}
        >
          
        </Tab>
      </Tabs>
    );
  }
}
