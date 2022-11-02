import React from 'react';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';

const colors = {'Vocals':'purple','Instruments':'pink','Tech':'primary'};
const date = new Date();
date.setHours(12);
const sunday = new Date(date);
sunday.setDate(sunday.getDate() + (7 - sunday.getDay()) % 7);
date.setDate(1);

class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: date,
            data: [],
            loading: true
        }
    }

    componentDidMount() {
        this.getSchedule(date.getMonth()+1, date.getFullYear());
    }
    getSchedule(month, year) {
        this.setState({
            loading: true
        })
        axios.get("https://praise.thewellgta.com/react-api/get-schedule.php", {
            params: {
                month: month,
                year: year
            }
        }).then(res => {
            if (res.error) {
                console.log(res.data);
            }
            else {
                this.setState({
                    data: res.data,
                    loading: false
                })
            }
        });
    }

    changeDate(num) {
        if (this.state.loading)
            return;
        const newDate = new Date(this.state.date);
        newDate.setMonth(newDate.getMonth()+num);
        this.setState({
            loading: true,
            date: newDate
        })
        this.getSchedule(newDate.getMonth()+1, newDate.getFullYear());
    }
    output(array, depth) {
        let ret = [];
        let i = 0;
        for(var k in array) {
            if (depth == 0) {
                ret.push(
                    <div key={i}>
                        <p className='date__header' key={1}>
                            {new Date(k).toLocaleDateString('default', {month:'long', day:'numeric', timeZone:'UTC'})}
                            {k == sunday.toISOString().split('T')[0] && <svg className='date__icon' viewBox='0 0 24 24'>
                                <path fill='currentColor' d='M11,9L12.42,10.42L8.83,14H18V4H20V16H8.83L12.42,19.58L11,21L5,15L11,9Z' />
                            </svg>}
                        </p>
                        <div className='card-grid' key={2}>{this.output(array[k], depth+1)}</div>
                    </div>
                );
            }
            else if (depth == 1) {
                ret.push(
                    <div className={`card card--availability card--${colors[k]}`} key={i}>
                        <div className='card__body'>
                            <div className='card__heading' key={1}>{k}</div>
                            <div className='card__subheading' key={2}>{array[k].length} members</div>
                            <div>{this.output(array[k], depth+1)}</div>
                        </div>
                    </div>
                );
            }
            else if (depth == 2) {
                ret.push (
                    <p className='date__name' key={i}>
                        <svg className='schedule__icon' viewBox='0 0 24 24' dangerouslySetInnerHTML={{__html: array[k][1]}}></svg>
                        {array[k][0]}
                    </p>
                );
            }
            i++;
        }
        return ret;
    }

    render() {
        return (
            <div className="body__container">
                <div className='card__header'>
                    <h2 className='availability-title'>
                        Schedule
                        {this.state.loading && <div className="footer__loader"></div>}
                    </h2>
                    <div style={{marginRight: '-16px'}} className='calendar-title--right'>
                        <a className="calendar__arrow" onClick={() => this.changeDate(-1)}>
                            <svg style={{width:'28px',height:'28px'}} viewBox="0 0 24 24">
                                <path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                            </svg>
                        </a>
                        <a className="calendar__arrow" onClick={() => this.changeDate(1)}>
                            <svg style={{width: '28px', height: '28px'}} viewBox="0 0 24 24">
                                <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                            </svg>
                        </a>
                    </div>
                </div>

                <CSSTransition 
                    in={!this.state.loading}
                    timeout={200}
                    classNames="display"
                    unmountOnExit
                >
                    <div>
                        {this.output(this.state.data, 0)}
                        {this.state.data.length == 0 && <p className='date__header' style={{fontWeight:400}}>
                        {this.state.date.toLocaleDateString('default', {month:'long', year:'numeric', timeZone:'UTC'})} schedule has not been uploaded yet.</p>}
                    </div>
                </CSSTransition>

            </div>
        )
    }
}

export default Schedule;