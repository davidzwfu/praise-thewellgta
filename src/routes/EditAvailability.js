import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

const date = new Date();
date.setDate(1);
date.setHours(12);
date.setMonth(date.getMonth()+1);

class EditAvailability extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            date: date,
            data: [],
            selected: [],
            calendar: [],
            member: JSON.parse(localStorage.getItem('calendarMember')) || {},
            submitted: false
        }
    }

    componentDidMount() {
        axios.get("https://praise.thewellgta.com/react-api/get-members.php").then(res => {
            if (res.error) {
                console.log(res.data);
            }
            else {
                this.setState({
                    data: res.data,
                })
            }
        });
        this.showCalendar(date);
    }

    selectRow(day, e) {
        if (day == null)
            return;
        let array = [...this.state.selected];
        var index = array.indexOf(day);
        if (index > -1)
            array.splice(index, 1);
        else
            array.push(day);
        this.setState({
            selected: array,
        })
    }
    selectMember(row) {
        this.setState({
            member: row,
        })
    }
    changeDate(num) {
        const newDate = new Date(this.state.date);
        newDate.setMonth(newDate.getMonth()+num);
        this.setState({
            date: newDate
        })
        this.showCalendar(newDate);
    }
    onSubmit() {
        if (this.state.submitted)
            return;
        this.setState({submitted: true});
        localStorage.setItem('calendarMember', JSON.stringify(this.state.member));
        axios.post("https://praise.thewellgta.com/react-api/add-availability.php", {
            id: this.state.member.id,
            month: this.state.date.getMonth()+1,
            year: this.state.date.getFullYear(),
            dates: this.state.selected
        }).then(res => {
            if (res.error) {
                console.log(res.data);
            }
            else {
                this.props.history.push('/availability');
                //history.push('/availability');
            }
        });
    }

    showCalendar(date) {
        let d = new Date(date);
        let month = d.getMonth();
        let output = [];
        let week = [];
        for (var i = 0; i < d.getDay(); i++)
            week.push(null);
        while (d.getMonth() == month) {
            week.push(d.toISOString().split('T')[0]);
            d.setDate(d.getDate()+1);
            if (d.getDay() == 0) {
                output.push(week);
                week = [];
            }
        }
        for (var i = d.getDay(); i < 7; i++)
            week.push(null);
        output.push(week);
        var selected = [];
        output.forEach(e => {
            if (e[0] != null)
                selected.push(e[0]);
        })
        this.setState({
            calendar: output,
            selected: selected
        })
    }

    render() {
        return (
            <>
                <div className="body__container body__container--calendar">
                    <div className='calendar-title calendar-title--center'>
                        Please select the Sundays that you are available.
                    </div>
                    <div className='card card--calendar'>
                        <a className="calendar__arrow calendar__arrow--float" style={{left:'-80px'}} onClick={() => this.changeDate(-1)}>
                            <svg style={{width:'32px',height:'32px'}} viewBox="0 0 24 24">
                                <path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                            </svg>
                        </a>
                        <a className="calendar__arrow calendar__arrow--float" style={{right:'-80px'}} onClick={() => this.changeDate(1)}>
                            <svg style={{width:'32px',height:'32px'}} viewBox="0 0 24 24">
                                <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                            </svg>
                        </a>
                        <div className='card__header' style={{padding:'0 28px'}}>
                            <div className='calendar-title'>
                                <p className='calendar-title__month' id='calendar-title__month'>{this.state.date.toLocaleString('default', {month:'long', timeZone: 'UTC'})}</p>
                                <p className='calendar-title__year'>{this.state.date.getFullYear()}</p>
                            </div>
                            <div className='calendar-title--right' id='availability'>
                                <Link to="/availability" className="button button--default">View Availability</Link>
                            </div>
                        </div>
                        <table className='calendar-table' id='calendar-table--sites' cellPadding='0' cellSpacing='0'>
                            <thead>
                                <tr className='header-row'>
                                    <th data-col='day' className='calendar-header no-sort'>Sun</th>
                                    <th data-col='day' className='calendar-header no-sort'>Mon</th>
                                    <th data-col='day' className='calendar-header no-sort'>Tue</th>
                                    <th data-col='day' className='calendar-header no-sort'>Wed</th>
                                    <th data-col='day' className='calendar-header no-sort'>Thu</th>
                                    <th data-col='day' className='calendar-header no-sort'>Fri</th>
                                    <th data-col='day' className='calendar-header no-sort'>Sat</th>
                                </tr>
                            </thead>
                            <tbody id='calendar-table__body'>
                                {this.state.calendar.map((week, weekIndex, weeks) => {
                                    return <tr className='table__body__row calendar__row' key={weekIndex} onClick={(e) => this.selectRow(week[0],e)}>
                                        {week.map((day, dayIndex, week) => {
                                            if (day == null)
                                                return <td className='calendar-cell' key={dayIndex}></td>;
                                            else
                                                return (
                                                    <td className='calendar-cell' key={dayIndex}>
                                                        <div className='calendar-cell__circle'>
                                                            <p className='calendar-cell__holiday'></p>
                                                            <p className='calendar-cell__day'>{+day.split('-')[2]}</p>
                                                        </div>
                                                        <div className='calendar-cell__div'>
                                                            {this.state.selected.includes(day) && 
                                                            <svg className='calendar__check' viewBox="0 0 24 24">
                                                                <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                                                            </svg>}
                                                        </div>
                                                    </td>
                                                );
                                        })}
                                    </tr>
                                })}
                            </tbody>
                        </table>
                        <div className='card__footer'>
                            <div className="input-field input-field--calendar input-field--select">
                                <input className="input-field__text input-field__text--fill" name="name" type="text"
                                    placeholder=" " autoComplete="off" value={this.state.member.name || ''} readOnly/>
                                <label className="input-field__label">Name</label>
                                <div className="input-field__unfocused-border"></div>
                                <div className="input-field__focused-border"></div>
                                <svg className="input-field__select--arrow" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                                </svg>
                                <div className="input-field__dropdown">
                                    {this.state.data.map(row => {
                                        return (
                                            <div className={`dropdown__option ${this.state.member.id == row.id ? 'selected' : ''}`} onClick={() => this.selectMember(row)} key={row.id}>
                                                <div>{row.name}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <button className='button button--primary button--large' disabled={this.state.member.name == null} onClick={() => this.onSubmit()}>
                                <div className={`button__text ${this.state.submitted ? 'hidden' : ''}`}>Submit</div>
                                {this.state.submitted && <div className='button__loader'></div>}
                            </button>
                        </div>
                    </div>       
                </div>
            </>
        )
    }
}

export default EditAvailability;