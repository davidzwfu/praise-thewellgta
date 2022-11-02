import React from 'react';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import pdf from '../assets/pdf-icon.svg';
import plus from '../assets/plus.svg';
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom';
import SheetsSearch from './SheetsSearch';
import SheetsSong from './SheetsSong';

class Sheets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            songs: [],
            recent: [],
            search: '',
            modal: '',
            title: '',
            song: '',
            selected: null,
            delete: null,
            submitting: false,
            loading: true
        };
        this.file = null;
        this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount() {
        let getSongs = axios.get("https://praise.thewellgta.com/react-api/get-songs.php");
        let getRecent = axios.get("https://praise.thewellgta.com/react-api/get-songsheets.php", {
            params: {
                order: 'date desc',
                limit: '5'
            }
        });
        axios.all([getSongs, getRecent]).then(axios.spread((...res) => {
            if (res[0].error)
                console.log(res[0].data);
            else
                this.setState({songs: res[0].data});
            if (res[1].error)
                console.log(res[1].data);
            else
                this.setState({recent: res[1].data});
            this.setState({loading: false});
        }))
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            if (this.props.location.search == '')
                this.setState({ search: '' });
        }
    }

    onSearch = (e) => {
        this.setState({ search: e.target.value });
    }
    onSong = (e) => {
        this.setState({ song: e.target.value });
    }
    onTitle = (e) => {
        this.setState({ title: e.target.value });
    }
    clearSearch() {
        this.setState({ search: '' });
        this.searchInput.focus();
    }
    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.history.push({
                pathname: '/sheets/search',
                search: `?q=${this.state.search}`
            });
        }
    }
    onChangeFile(e) {
        var file = e.target.files[0];
        if (file) {
            this.setState({modal: 'add'});
            this.file = file;
        }
    }
    onAdd() {
        this.fileInput.click();
        //this.setState({modal: 'add'});
    }
    onMore = (id, e) => {
        this.setState({ selected: id });
    }
    onBlur = (e) => {
        this.setState({ selected: null });
    }
    onDelete(id) {
        this.setState({
            selected: null,
            delete: id,
            modal: 'delete'
        });
    }
    hideModal() {
        if (this.state.submitting)
            return;
        this.setState({
            modal: null,
            title: '',
            song: '',
            selected: null
        });
        this.fileInput.value = '';
        //this.file = { name: '', size: 0 };
    }

    bytesToSize(bytes) {
        if (!bytes)
            return;
        var sizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
    submitDelete() {
        if (this.state.submitting)
            return;
        this.setState({submitting: true});
        axios.post("https://praise.thewellgta.com/react-api/delete-songsheet.php", {
            id: this.state.delete
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
        var formData = new FormData();
        formData.append('file', this.file);
        formData.append('size', this.file.size);
        formData.append('title', this.state.title);
        formData.append('song', this.state.song);
        axios.post("https://praise.thewellgta.com/react-api/add-songsheet.php", formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            if (res.data) {
                console.log(res.data);
            }
            else {
                window.location.reload();
            }
        });
    }

    renderRecent() {
        return this.state.recent.map((el, index) => {
            return <div className="songsheets-grid__item" key={index}>
                <Link className="songsheets-grid__link" to={`/files/${el.file}`} target="_blank">
                    <div className="songsheets-grid__img-wrapper">
                        <img className="songsheets-grid__img" src={pdf}/>
                    </div>
                    <div className="songsheets-grid__block">
                        <p className="songsheets-grid__title">{el.title}</p>
                        <p className="songsheets-grid__subtitle">{el.song}</p>
                    </div>
                </Link>
                <div onBlur={this.onBlur} tabIndex="-1">
                    <svg className="songsheets-grid__more" viewBox="0 0 24 24" onClick={(e) => this.onMore(el.id, e)}>
                        <path fill="currentColor" d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" />
                    </svg>
                    <CSSTransition 
                        in={this.state.selected == el.id}
                        timeout={267}
                        classNames="menu"
                        unmountOnExit
                    >
                        <div className="dropdown-menu">
                            {/* <span className="dropdown-menu__item">
                                <p className="dropdown-menu__text">Edit</p>
                            </span> */}
                            <span className="dropdown-menu__item" onClick={() => this.onDelete(el.id)}>
                                <p className="dropdown-menu__text">Delete</p>
                            </span>
                        </div>   
                    </CSSTransition>
                </div>
            </div>;
        });
    }
    renderSongs() {
        return this.state.songs.map((el, index) => {
            return <Link className="songsheets-grid__item songsheets-grid__item--small" key={index}
                to={{
                    pathname: `/sheets/song/${el.song.toLowerCase().replaceAll(' ', '-')}`
                }}>
                <div className="songsheets-grid__flex">
                    <svg className="songsheets-grid__icon" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M10 4L12 6H20C21.1 6 22 6.89 22 8V18C22 19.1 21.1 20 20 20H4C2.89 20 2 19.1 2 18L2 6C2 4.89 2.89 4 4 4H10M19 9H15.5V13.06L15 13C13.9 13 13 13.9 13 15C13 16.11 13.9 17 15 17C16.11 17 17 16.11 17 15V11H19V9Z" />
                    </svg>
                    <p className="songsheets-grid__title">{el.song}</p>
                </div>
            </Link>;
        });
    }

    render() {
        return (
            <div className="body__container">

                <div className="searchbar-wrapper">
                    <div className="searchbar">
                        <svg className="searchbar__icon" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                        </svg>
                        <input ref={input => {this.searchInput = input}} className="searchbar__input" placeholder="Search in Music Sheets" 
                            value={this.state.search} onChange={this.onSearch} onKeyPress={this.onKeyPress} />
                        <div className="searchbar__close" onClick={() => this.clearSearch()} tabIndex="-1">
                            <svg className="searchbar__icon" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                            </svg>
                        </div>
                    </div>

                    <button className="new-button" onClick={() => this.onAdd()}>
                        <img className="new-button__img" src={plus} />
                        <p className="new-button__text">New</p>
                        <input className="new-button__input" type="file" ref={input => this.fileInput = input} onChange={this.onChangeFile.bind(this)}/>
                    </button>
                </div>

                <Switch>
                    <Route exact path="/sheets/search" render={(props) => <SheetsSearch {...props} onDelete={this.onDelete} />}/>
                    <Route exact path="/sheets/song/:song" render={(props) => <SheetsSong {...props} onDelete={this.onDelete} />}/>
                    <Route exact path="/sheets">
                        <div className="songsheets-navbar">
                            <div className="songsheets-navbar__link">Music Sheets</div>
                        </div>

                        <CSSTransition 
                            in={!this.state.loading}
                            timeout={200}
                            classNames="display"
                            unmountOnExit
                        >
                            <div>
                                <div className="songsheets-header">
                                    <h3 className="songsheets-header__title">Recent</h3>
                                </div>
                                <div className="songsheets-grid">
                                    {this.renderRecent()}
                                </div>
                                <div className="songsheets-header">
                                    <h3 className="songsheets-header__title">Songs</h3>
                                </div>
                                <div className="songsheets-grid songsheets-grid--small">
                                    {this.renderSongs()}
                                </div>
                            </div>
                        </CSSTransition>
                    </Route>
                </Switch>

                <CSSTransition in={this.state.modal == 'add'} timeout={300} classNames="modal" unmountOnExit>
                    <div className="modal">
                        <div className="modal__overlay" onClick={() => this.hideModal()}></div>

                        <div className="modal__card">
                            <div className="modal__header">
                                <h2 className="modal__header__text">
                                    Upload file
                                </h2>
                            </div>
                            <form className="modal__form">
                                <div className="modal__form__group">
                                    <div className="modal__form__row">
                                        <div className="input-field input-field--roles">
                                            <input className="input-field__text input-field__text--fill" name="title" type="text"
                                                placeholder=" " autoComplete="off" value={this.state.title} onChange={this.onTitle} />
                                            <label className="input-field__label">Title</label>
                                            <div className="input-field__unfocused-border"></div>
                                            <div className="input-field__focused-border"></div>
                                        </div>
                                        <div className="input-field input-field--roles">
                                            <input className="input-field__text input-field__text--fill" name="song" type="text"
                                                placeholder=" " autoComplete="off" value={this.state.song} onChange={this.onSong} />
                                            <label className="input-field__label">Song</label>
                                            <div className="input-field__unfocused-border"></div>
                                            <div className="input-field__focused-border"></div>

                                        </div>
                                    </div>
                                    <div className="modal__form__row">
                                        <div className="input-field input-field--roles">
                                            <input className="input-field__text input-field__text--fill" name="filename" type="text"
                                                placeholder=" " autoComplete="off" readOnly value={this.file?.name} />
                                            <label className="input-field__label">File</label>
                                            <div className="input-field__unfocused-border"></div>
                                            <div className="input-field__focused-border"></div>
                                        </div>
                                        <div className="input-field input-field--roles">
                                            <input className="input-field__text input-field__text--fill" name="filesize" type="text"
                                                placeholder=" " autoComplete="off" readOnly value={this.bytesToSize(this.file?.size)} />
                                            <label className="input-field__label">Size</label>
                                            <div className="input-field__unfocused-border"></div>
                                            <div className="input-field__focused-border"></div>

                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="modal__footer">
                                <div className="align-right display-flex">
                                    <button className="button button--default" type="button" onClick={() => this.hideModal()}>
                                        Cancel
                                    </button>
                                    <button className="button button--primary" type="button" 
                                    onClick={() => this.submitAdd()} disabled={this.state.title == '' || this.state.song == ''}>
                                        <div className={`button__text ${this.state.submitting ? 'hidden' : ''}`}>Submit</div>
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
                                    Delete file
                                </h2>
                            </div>
                            <div className="modal__body">
                                <div>Are you sure you want to delete this file?</div>
                            </div>
                            <div className="modal__footer">
                                <div className="align-right display-flex">
                                    <button className="button button--default" type="button" onClick={() => this.hideModal()}>
                                        Cancel
                                    </button>
                                    <button className="button button--primary" type="button" onClick={() => this.submitDelete()}>
                                        <div className={`button__text ${this.state.submitting ? 'hidden' : ''}`}>Confirm</div>
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

export default Sheets;