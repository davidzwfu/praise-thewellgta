import React from 'react';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import pdf from '../assets/pdf-icon.svg';
import { Link } from 'react-router-dom';

class SheetsSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sheets: [],
            q: new URLSearchParams(this.props.location.search).get('q'),
            loading: true
        }
    }

    fetch(query) {
        axios.get("https://praise.thewellgta.com/react-api/get-songsheets.php", {
            params: {
                search: query,
                order: 'song,title'
            }
        }).then(res => {
            if (res.error) {
                console.log(res.data);
            }
            else {
                this.setState({
                    sheets: res.data || [],
                    loading: false
                })
            }
        });
    }

    componentDidMount() {
        this.fetch(this.state.q);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location.search !== this.props.location.search) {
            var query = new URLSearchParams(this.props.location.search).get('q');
            this.setState({
                q: query,
                loading: true
            });
            this.fetch(query);
        }
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
                    <div to="/sheets" className="songsheets-navbar__link">Search results</div>
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

export default SheetsSearch;