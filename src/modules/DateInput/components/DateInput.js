import moment from 'moment';
import React, { Component, PropTypes } from 'react';

// import './DateInput.scss';

export default class DateInput extends Component {

  static propTypes = {
    type: PropTypes.string.isRequired,
    date: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  }

  constructor (props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onTodayClick = this.onTodayClick.bind(this);

    this.state = {};
  }

  onChange () {

    let date;

    if (this.refs.date) {
      date = new Date(this.refs.date.value + ' ' + this.refs.time.value);
    } else {
      date = new Date(this.props.date);

      const vals = this.refs.time.value.split(':');
      date.setHours(vals[0]);
      date.setMinutes(vals[1]);
    }

    this.props.onChange({
      date
    });
  }

  onTodayClick () {
    this.setState({
      showDate: true
    });
  }

  render () {

    const className = `record-date record-date--${this.props.type}`;

    const dateObject = moment(this.props.date);

    const date = dateObject.format('YYYY-MM-DD');
    const time = dateObject.format('HH:mm');

    const dateDisplay = (
      <input type='date'
        ref='date'
        defaultValue={date}
        onChange={this.onChange}
        className='record-date__input record-date__input--date'
        disabled={this.props.disabled}
       />
    );
    const timeDisplay = (
      <input type='time'
        ref='time'
        defaultValue={time}
        onChange={this.onChange}
        className='record-date__input record-date__input--time'
        disabled={this.props.disabled}
       />
    );

    let isToday = moment().isSame(dateObject, 'day');
    let today = <span className='record-date__today' onClick={this.onTodayClick}>Today</span>;

    return (
      <span className={className}>
        {isToday && !this.state.showDate ? today : dateDisplay}
        {timeDisplay}
      </span>
    );
  }
}
