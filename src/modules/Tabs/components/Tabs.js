import React, { Component, PropTypes } from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import Slider from 'material-ui/Slider'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

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

  constructor (props) {
    super(props);

    this.onAddClick = this.onAddClick.bind(this);
  }

  handleActive(tab) {
    console.log(`A tab with this route property ${tab.props['data-route']} was activated.`);
  }

  onAddClick () {
    this.props.addTab();
  }

  render () {
    return (
      <div className="tabs">
        <Tabs className="tabs-tabs">
          <Tab label="Alle"></Tab>
          {this.props.tabs.map(t => <Tab key={t.cuid} label={t.name}></Tab>)}
        </Tabs>
        <FloatingActionButton mini={true} className="tabs-add" onClick={this.onAddClick}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}
