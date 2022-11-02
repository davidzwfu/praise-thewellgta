import React from 'react';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import pdf from '../assets/pdf-icon.svg';
import { Link } from 'react-router-dom';

class SheetsSong extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            song: this.props.match.params.song.replaceAll('-', ' '),
            sheets: [],
            selected: null,
            loading: true
        }
    }

    componentDidMount() {
        axios.get("https://praise.thewellgta.com/react-api/get-songsheets.php", {
            params: {
                song: this.state.song,
                order: 'title'
            }
        }).then(res => {
            if (res.error) {
                console.log(res.data);
            }
            else {
                this.setState({
                    sheets: res.data,
                    loading: false
                })
            }
        });
    }

    onMore = (id) => {
        this.setState({ selected: id });
    }
    onBlur = (e) => {
        this.setState({ selected: null });
    }
    onDelete(id) {
        this.setState({ selected: null });
        this.props.onDelete(id);
    }

    renderRecent() {
        return this.state.sheets.map((el, index) => {
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
                    <svg className="songsheets-grid__more" viewBox="0 0 24 24" onClick={(e) => this.onMore(el.id)}>
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

    render() {
        return (
            <>
                <div className="songsheets-navbar">
                    <Link to="/sheets" className="songsheets-navbar__link songsheets-navbar__link--hover">Music Sheets</Link>
                    <svg className="songsheets-navbar__icon" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                    </svg>
                    <div className="songsheets-navbar__link">{ this.state.song }</div>
                </div>

                <CSSTransition 
                    in={!this.state.loading}
                    timeout={200}
                    classNames="display"
                    unmountOnExit
                >
                    <div>
                        <div className="songsheets-header">
                            <h3 className="songsheets-header__title">Files</h3>
                        </div>
                        <div className="songsheets-grid">
                            {this.renderRecent()}
                        </div>
                    </div>
                </CSSTransition>
            </>
        )
    }
}

export default SheetsSong;