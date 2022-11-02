import React from 'react';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';

const colors = {'Leader':'yellow','Vocal':'purple','Keys':'pink','Cajon':'pink','Guitar':'pink','Elec':'pink','Violin':'pink','Cello':'pink','Sound':'primary'};

class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            members: [],
            roles: [],
            selected: {},
            modal: '',
            loading: true,
            submitting: false
        }
        this.delete = null;
    }

    componentDidMount() {
        axios.get("https://praise.thewellgta.com/react-api/get-member-roles.php").then(res => {
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

        let request1 = axios.get("https://praise.thewellgta.com/react-api/get-member-roles.php");
        let request2 = axios.get("https://praise.thewellgta.com/react-api/get-members.php");
        let request3 = axios.get("https://praise.thewellgta.com/react-api/get-roles.php");
        axios.all([request1, request2, request3]).then(axios.spread((...res) => {
            if (res[0].error) console.log(res[0].data);
            else this.setState({data: res[0].data})
            if (res[1].error) console.log(res[1].data);
            else this.setState({members: res[1].data})
            if (res[2].error) console.log(res[2].data);
            else this.setState({roles: res[2].data})
            this.setState({
                loading: false
            })
        }))
    }

    hideModal() {
        if (this.state.submitting)
            return;
        this.setState({
            modal: null,
            selected: {}
        });
        this.delete = null;
    }
    onAddRole() {
        this.setState({modal: 'add'});
    }
    onDelete(id) {
        this.delete = id;
        this.setState({
            modal: 'delete'
        });
    }
    selectRole(row) {
        var selected = {...this.state.selected};
        selected.role = row.role;
        selected.rid = row.id;
        this.setState({
            selected: selected
        });
    }
    selectMember(row) {
        var selected = {...this.state.selected};
        selected.name = row.name;
        selected.mid = row.id;
        this.setState({
            selected: selected
        });
    }

    submitDelete() {
        if (this.state.submitting)
            return;
        this.setState({submitting: true});
        axios.post("https://praise.thewellgta.com/react-api/delete-member-role.php", {
            id: this.delete
        }).then(res => {
            if (res.error) {
                console.log(res.data);
            }
            else {
                window.location.reload();
            }
        });
    }
    submitAdd() {
        if (this.state.submitting)
            return;
        this.setState({submitting: true});
        axios.post("https://praise.thewellgta.com/react-api/add-member-role.php", {
            rid: this.state.selected.rid,
            mid: this.state.selected.mid
        }).then(res => {
            if (res.error) {
                console.log(res.data);
            }
            else {
                window.location.reload();
            }
        });
    }

    render() {
        return (
            <div className="body__container">
                <div className='card__header'>
                    <h2 className='availability-title'>
                        Roles
                        {this.state.loading && <div className="footer__loader"></div>}
                    </h2>
                    <div className='calendar-title--right'>
                        <button className="button button--default" onClick={() => this.onAddRole()}>Add Role</button>
                    </div>
                </div>

                <CSSTransition 
                    in={!this.state.loading}
                    timeout={200}
                    classNames="display"
                    unmountOnExit
                >
                    <div className='card-grid'>
                        {Object.keys(this.state.data).map((role, roleIndex) => {
                            return (
                                <div className={`card card--${colors[role.split('/')[1]]} card--availability`} key={roleIndex}>
                                    <div className='card__body'>
                                        <div className='card__heading'>{role.split('/')[1]}</div>
                                        <div className='card__subheading'></div>
                                        {this.state.data[role].map((el, index) => {
                                            return <p className='date__name' key={index}>
                                                <span>{el.name}</span>
                                                <svg className='name__icon' viewBox='0 0 24 24' onClick={() => this.onDelete(el.id)}>
                                                    <path fill='currentColor' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'/>
                                                </svg>
                                            </p>
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CSSTransition>

                <CSSTransition in={this.state.modal == 'add'} timeout={300} classNames="modal" unmountOnExit>
                    <div className="modal">
                        <div className="modal__overlay" onClick={() => this.hideModal()}></div>

                        <div className="modal__card">
                            <div className="modal__header">
                                <h2 className="modal__header__text">
                                    Add role
                                </h2>
                                <button className="button button--borderless button--secondary modal__button" onClick={() => this.hideModal()}>
                                    <svg className="modal__button__icon" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                    </svg>
                                </button>
                            </div>
                            <form className="modal__form">
                                <div className="modal__form__group">
                                    <div className="modal__form__row">
                                        <div className="input-field input-field--roles input-field--select">
                                            <input className="input-field__text input-field__text--fill" name="role" type="text"
                                                placeholder=" " autoComplete="off" readOnly value={this.state.selected.role || ''}></input>
                                            <label className="input-field__label">Role</label>
                                            <div className="input-field__unfocused-border"></div>
                                            <div className="input-field__focused-border"></div>
                                            <svg className="input-field__select--arrow" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                                            </svg>
                                            <div className="input-field__dropdown">
                                                {this.state.roles.map((row, index) => {
                                                    return (
                                                        <div className={`dropdown__option ${this.state.selected?.rid == row.id ? 'selected' : ''}`} 
                                                            onClick={() => this.selectRole(row)} key={index}>
                                                            <div>{row.role}</div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div className="input-field input-field--roles input-field--select">
                                            <input className="input-field__text input-field__text--fill" name="member" type="text"
                                                placeholder=" " autoComplete="off" readOnly value={this.state.selected.name || ''}></input>
                                            <label className="input-field__label">Member</label>
                                            <div className="input-field__unfocused-border"></div>
                                            <div className="input-field__focused-border"></div>
                                            <svg className="input-field__select--arrow" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                                            </svg>
                                            <div className="input-field__dropdown">
                                                {this.state.members.map((row, index) => {
                                                    return (
                                                        <div className={`dropdown__option ${this.state.selected?.mid == row.id ? 'selected' : ''}`}
                                                            onClick={() => this.selectMember(row)} key={index}>
                                                            <div>{row.name}</div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="modal__footer">
                                <div className="align-right display-flex">
                                    <button className="button button--default" type="button" onClick={() => this.hideModal()}>
                                        Cancel
                                    </button>
                                    <button className="button button--primary" type="button" disabled={this.state.selected.rid == null || this.state.selected.mid == null}>
                                        <div className={`button__text ${this.state.submitting ? 'hidden' : ''}`}
                                        onClick={() => this.submitAdd()}>Submit</div>
                                        {this.state.submitting && <div className='button__loader'></div>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CSSTransition>

                <CSSTransition in={this.state.modal == 'delete'} timeout={300} classNames="modal" unmountOnExit>
                    <div className="modal">
                        <div className="modal__overlay" onClick={() => this.hideModal()}></div>

                        <div className="modal__card">
                            <div className="modal__header">
                                <h2 className="modal__header__text">
                                    Delete role
                                </h2>
                                <button className="button button--borderless button--secondary modal__button" onClick={() => this.hideModal()}>
                                    <svg className="modal__button__icon" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="modal__body">
                                <div>Are you sure you want to delete this role?</div>
                            </div>
                            <div className="modal__footer">
                                <div className="align-right display-flex">
                                    <button className="button button--default" type="button" onClick={() => this.hideModal()}>
                                        Cancel
                                    </button>
                                    <button className="button button--primary" type="button">
                                        <div className={`button__text ${this.state.submitting ? 'hidden' : ''}`}
                                        onClick={() => this.submitDelete()}>Confirm</div>
                                        {this.state.submitting && <div className='button__loader'></div>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CSSTransition>

            </div>
        )
    }
}

export default Schedule;