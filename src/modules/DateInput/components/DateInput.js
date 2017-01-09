import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import TimeInput from 'time-input';
import Flatpickr from 'react-flatpickr'

import 'flatpickr/dist/themes/airbnb.css';

import './DateInput.scss';

export default class DateInput extends Component {

    static propTypes = {
        date: PropTypes.any,
        onChange: PropTypes.func.isRequired,
        disabled: PropTypes.bool
    }

    constructor (props) {
        super(props);

        this.onDateChange = this.onDateChange.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);

        this.state = {
            date: null,
            time: null
        };
    }

    componentWillMount () {
        const dateObject = moment(this.props.date);

        const date = dateObject.toDate();
        const time = dateObject.format('HH:mm');

        this.setState({
            date,
            time
        });
    }

    static createDateObjectFromDateAndTime ({ date, time }) {
        date = moment(date).toDate();
        const timeParts = time.split(':');
        date.setHours(timeParts[0]);
        date.setMinutes(timeParts[1]);
        return date;
    }

    onTimeChange (time) {

        const date = DateInput.createDateObjectFromDateAndTime({
            date: new Date(this.state.date),
            time
        });

        this.props.onChange({
            date
        });

        this.setState({
            time
        });
    }

    onDateChange ([date]) {

        const { time } = this.state;

        date = DateInput.createDateObjectFromDateAndTime({
            date,
            time
        });

        this.props.onChange({
            date
        });

        this.setState({
            date
        });
    }

    getDateDisplay () {
        const { date } = this.state;
        if (!date) {
            return '';
        }
        return moment(date).format('ll');
    }

    render () {

        const { time, date } = this.state;

        return (
            <span className='date-inp'>
                <span className='date-inp-date'>
                    <span className='date-inp-date__display'>{this.getDateDisplay()}</span>
                    <Flatpickr onChange={this.onDateChange} options={{ defaultDate: date }} />
                </span>
                <TimeInput
                  value={time}
                  className='date-inp__input date-inp__input--time'
                  onChange={this.onTimeChange}
                  disabled={this.props.disabled}
            />
            </span>
        );
    }
}
