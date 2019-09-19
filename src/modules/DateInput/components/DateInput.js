import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import TimeInput from 'time-input';
// import Flatpickr from 'react-flatpickr'
import Flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

import './DateInput.scss';

export default class DateInput extends Component {
    static propTypes = {
        date: PropTypes.any,
        onChange: PropTypes.func.isRequired,
        disabled: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.onDateInputChanged = this.onDateInputChanged.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);

        this.state = {
            date: null,
            time: null
        };
    }

    componentWillMount() {
        this.setDateState(this.props.date);
    }

    componentDidMount() {
        this.fp = new Flatpickr(this.dateInput, {
            defaultDate: this.state.date,
            onChange: dates => this.onDateChanged(dates[0])
        });
    }

    componentDidUpdate() {
        if (!moment(this.props.date).isSame(this.state.date)) {
            if (this.fp) {
                this.fp.setDate(this.props.date, false);
                this.setDateState(this.props.date);
            }
        }
    }

    componentWillUnmount() {
        if (this.fp) {
            this.fp.destroy();
        }
    }

    setDateState(_date) {
        const dateObject = moment(_date);

        const date = dateObject.toDate();
        const time = dateObject.format('HH:mm');

        this.setState({
            date,
            time
        });
    }

    static createDateObjectFromDateAndTime({ date, time }) {
        date = moment(date).toDate();
        const timeParts = time.split(':');
        date.setHours(timeParts[0]);
        date.setMinutes(timeParts[1]);
        return date;
    }

    onTimeChange(time) {
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

    onDateInputChanged(e) {
        this.onDateChanged(e.target.value);
    }

    onDateChanged(date) {
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

    getDateDisplay() {
        const { date } = this.state;
        if (!date) {
            return '';
        }
        return moment(date).format('MMM D');
    }

    render() {
        const { time } = this.state;

        return (
            <span className="date-inp">
                <span className="date-inp-date">
                    <span className="date-inp-date__display">{this.getDateDisplay()}</span>
                    <input
                        className="date-inp-date__input"
                        type="date"
                        tabIndex="-1"
                        onChange={this.onDateInputChanged}
                        ref={el => (this.dateInput = el)}
                    />
                </span>
                <TimeInput
                    value={time}
                    className="date-inp__input date-inp__input--time"
                    onChange={this.onTimeChange}
                    disabled={this.props.disabled}
                />
            </span>
        );
    }
}
