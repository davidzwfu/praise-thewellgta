import React from 'react';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';

const colors = {'Vocals':'purple','Instruments':'pink','Tech':'primary'};
const date = new Date();
date.setDate(1);
date.setHours(12);
date.setMonth(date.getMonth()+1);

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: date,
            data: [],
            sound: [],
            selected: {},
            frequency: {},
            saving: false,
            submitting: false,
            loading: true
        }
    }

    componentDidMount() {
        let request1 = axios.get("https://praise.thewellgta.com/react-api/get-sound.php");
        let request2 = axios.get("https://praise.thewellgta.com/react-api/get-admin.php", {
            params: {
                month: date.getMonth()+1,
                year: date.getFullYear()
            }
        });
        let request3 = axios.get("https://praise.thewellgta.com/react-api/get-saved-admin.php", {
            params: {
                month: date.getMonth()+1,
                year: date.getFullYear()
            }
        });
        axios.all([request1, request2, request3]).then(axios.spread((...res) => {
            if (res[0].error)
                console.log(res[0].data);
            else
                this.setState({sound: res[0].data})
            if (res[1].error)
                console.log(res[1].data);
            else
                this.setState({data: res[1].data})
            if (res[2].error)
                console.log(res[2].data);
            else
                this.setState({selected: res[2].data})
            let frequency = {};
            for (const el of Object.values(res[2].data)) {
                if (frequency[el.name] == undefined)
                    frequency[el.name] = 1;
                else 
                    frequency[el.name] += 1;
            }
            this.setState({
                frequency: frequency,
                loading: false
            });
        }))
    }
    getAdmin(month, year) {
        let request1 = axios.get("https://praise.thewellgta.com/react-api/get-admin.php", {
            params: {
                month: month,
                year: year
            }
        });
        let request2 = axios.get("https://praise.thewellgta.com/react-api/get-saved-admin.php", {
            params: {
                month: month,
                year: year
            }
        });
        axios.all([request1, request2]).then(axios.spread((...res) => {
            if (res[0].error)
                console.log(res[0].data);
            else
                this.setState({data: res[0].data})
            if (res[1].error)
                console.log(res[1].data);
            else
                this.setState({selected: res[1].data})
            let frequency = {};
            for (const el of Object.values(res[1].data)) {
                if (frequency[el.name] == undefined)
                    frequency[el.name] = 1;
                else 
                    frequency[el.name] += 1;
            }
            this.setState({
                frequency: frequency,
                loading: false
            })
        }))
    }

    changeDate(num) {
        if (this.state.loading)
            return;
        const newDate = new Date(this.state.date);
        newDate.setMonth(newDate.getMonth()+num);
        this.setState({
            loading: true,
            frequency: {},
            selected: {},
            date: newDate
        })
        this.getAdmin(newDate.getMonth()+1, newDate.getFullYear());
    }
    clear() {
        this.setState({
            selected: {},
            frequency: {}
        });
    }
    selectMember(date,role,row) {
        let selected = {...this.state.selected};
        if (row == null)
            delete selected[date+role];
        else {
            let tempRow = {...row};
            tempRow.date = date;
            selected[date+role] = tempRow;
        }
        this.setState({
            selected: selected,
        })
        let frequency = {};
        for (const el of Object.values(selected)) {
            if (frequency[el.name] == undefined)
                frequency[el.name] = 1;
            else 
                frequency[el.name] += 1;
        }
        this.setState({
            frequency: frequency,
        })
    }
    onSave() {
        if (this.state.saving)
            return;
        this.setState({saving: true});
        axios.post("https://praise.thewellgta.com/react-api/save-schedule.php", {
            month: this.state.date.getMonth()+1,
            year: this.state.date.getFullYear(),
            selected: this.state.selected
        }).then(res => {
            if (res.error) {
                console.log(res.data);
            }
            else {
                window.location.reload();
            }
        });
    }
    onSubmit() {
        if (this.state.submitting)
            return;
        this.setState({submitting: true});
        axios.post("https://praise.thewellgta.com/react-api/submit-schedule.php", {
            month: this.state.date.getMonth()+1,
            year: this.state.date.getFullYear(),
            selected: this.state.selected
        }).then(res => {
            if (res.error) {
                console.log(res.data);
            }
            else {
                this.props.history.push('/schedule');
            }
        });
    }

    render() {
        return (
            <div className="body__container">
                <div className='card__header'>
                    <h2 className='availability-title'>
                        Admin
                        {this.state.loading && <div className="footer__loader"></div>}
                    </h2>
                    <div className='calendar-title--right'>
                        {/* <button className="button button--default">Auto Fill</button> */}
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
                        <button className="button button--default" style={{marginLeft: '12px'}} onClick={() => this.clear()} >Clear</button>
                    </div>
                </div>

                <CSSTransition 
                    in={Object.keys(this.state.frequency).length > 0}
                    timeout={200}
                    classNames="display"
                    unmountOnExit
                >
                    <div>
                        <p className='date__header' style={{marginBottom:'-16px'}}></p>
                        <div className='card-grid card-grid--stretch'>
                            <div className='card card--availability card--gray'>
                                <div className='card__body'>
                                    <div className='card__heading'>Frequency</div>
                                    <div className='card__subheading'></div>
                                    {Object.keys(this.state.frequency).map((name, index) => {
                                        return <p className='date__name' key={index}>{name} {this.state.frequency[name]}</p>
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </CSSTransition>

                <CSSTransition 
                    in={!this.state.loading}
                    timeout={200}
                    classNames="display"
                    unmountOnExit
                >
                    <div>
                        {Object.keys(this.state.data).map((date) => {
                            return (
                                <div key={date}>
                                    <p className='date__header'>{new Date(date).toLocaleDateString('default', {month:'long', day:'numeric', timeZone:'UTC'})}</p>
                                    <div className='card-grid'>
                                        {Object.keys(this.state.data[date]).map((group) => {
                                            return (
                                                <div className={`card card--availability card--${colors[group]}`} key={group}>
                                                    <div className='card__body card__body--admin'>
                                                        <div className="card__heading">{group}</div>
                                                        <div className="card__subheading"></div>
                                                        {Object.keys(this.state.data[date][group]).map((role) => {
                                                            return (
                                                                <div className='input-field input-field--admin input-field--select' key={role}>
                                                                    <input className='input-field__text input-field__text--fill' name='name' type='text' placeholder=' ' readOnly
                                                                        value={this.state.selected[date+role]?.name || ''}></input>
                                                                    <label className='input-field__label'>{role.split('/')[1]}</label>
                                                                    <div className='input-field__unfocused-border'></div>
                                                                    <div className='input-field__focused-border'></div>
                                                                    <svg className="input-field__select--arrow" viewBox="0 0 24 24">
                                                                        <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                                                                    </svg>
                                                                    <div className="input-field__dropdown">
                                                                        <div className="dropdown__option" onClick={() => this.selectMember(date,role,null)} key={-1}></div>
                                                                        {this.state.data[date][group][role].map((row, rowIndex) => {
                                                                            return (
                                                                                <div className={`dropdown__option ${this.state.selected[date+role]?.mid == row?.mid ? 'selected' : ''}`} onClick={() => this.selectMember(date,role,row)} key={rowIndex}>
                                                                                    <div>{row.name}</div>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                        
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div className='card card--primary card--availability' key='Sound'>
                                            <div className='card__body card__body--admin'>
                                                <div className="card__heading">Tech</div>
                                                <div className="card__subheading"></div>
                                                <div className='input-field input-field--admin input-field--select' key={'Sound'}>
                                                    <input className='input-field__text input-field__text--fill' name='name' type='text' placeholder=' ' readOnly
                                                        value={this.state.selected[date+'12/Sound']?.name || ''}></input>
                                                    <label className='input-field__label'>Sound</label>
                                                    <div className='input-field__unfocused-border'></div>
                                                    <div className='input-field__focused-border'></div>
                                                    <svg className="input-field__select--arrow" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                                                    </svg>
                                                    <div className="input-field__dropdown">
                                                        <div className="dropdown__option" onClick={() => this.selectMember(date,'12/Sound',null)} key={-1}></div>
                                                        {this.state.sound.map((row, rowIndex) => {
                                                            return (
                                                                <div className={`dropdown__option ${this.state.selected[date+'12/Sound']?.mid == row?.mid ? 'selected' : ''}`} onClick={() => this.selectMember(date,'12/Sound',row)} key={rowIndex}>
                                                                    <div>{row.name}</div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {Object.keys(this.state.data).length > 0 ? 
                        <div className='card__footer card__footer--admin'>
                            <button className='button button--default button--large' style={{marginRight: '12px'}} onClick={() => this.onSave()}>
                                <div className={`button__text ${this.state.saving ? 'hidden' : ''}`}>Save</div>
                                {this.state.saving && <div className='button__loader'></div>}
                            </button>
                            <button className='button button--primary button--large' onClick={() => this.onSubmit()}>
                                <div className={`button__text ${this.state.submitting ? 'hidden' : ''}`}>Submit</div>
                                {this.state.submitting && <div className='button__loader'></div>}
                            </button>
                        </div>
                        :
                        <p className='date__header' style={{fontWeight:400}}>
                        {this.state.date.toLocaleDateString('default', {month:'long', year:'numeric', timeZone:'UTC'})} availability has not been uploaded yet.</p>
                        }
                        
                    </div>
                </CSSTransition>
            </div>
        )
    }
}

export default Admin;