import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import TimeInput from 'time-input';

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

    this.onDateChange = this.onDateChange.bind(this);
    this.onTimeChange = this.onTimeChange.bind(this);
    this.onTodayClick = this.onTodayClick.bind(this);

    this.state = {
      date: null
    };
  }

  componentWillMount () {
    const dateObject = moment(this.props.date);

    const date = dateObject.format('YYYY-MM-DD');
    const time = dateObject.format('HH:mm');

    this.setState({
      date,
      time
    });
  }

  onTimeChange (time) {

    const vals = time.split(':');
    const date = new Date(this.state.date);
    
    date.setHours(vals[0]);
    date.setMinutes(vals[1]);

    this.props.onChange({
      date
    });

    this.setState({
      time
    });
  }

  onDateChange () {
    
    let date;

    if (this.refs.date) {
      date = new Date(this.refs.date.value + ' ' + this.refs.time.value);
    } else {
      date = new Date(this.state.date);

      const vals = this.refs.time.value.split(':');
      date.setHours(vals[0]);
      date.setMinutes(vals[1]);
    }

    this.props.onChange({
      date
    });

    this.setState({
      date
    });
  }

  onTodayClick () {
    this.setState({
      showDate: true
    });
  }

  render () {

    const { time, date } = this.state;

    const className = `record-date record-date--${this.props.type}`;

    const dateDisplay = (
      <input type='date'
        ref='date'
        defaultValue={date}
        onChange={this.onDateChange}
        className='record-date__input record-date__input--date'
        disabled={this.props.disabled}
       />
    );

    let isToday = moment().isSame(moment(date), 'day');
    let today = <span className='record-date__today' onClick={this.onTodayClick}>Today</span>;

    return (
      <span className={className}>
        {isToday && !this.state.showDate ? today : dateDisplay}
        <TimeInput
          value={time}
          className='record-date__input record-date__input--time'
          onChange={this.onTimeChange}
          disabled={this.props.disabled}
        />
      </span>
    );
  }
}
