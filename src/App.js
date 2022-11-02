import React from 'react';
import './App.css';
import logo from './assets/well-logo-small.png';
import { Route, Switch, NavLink } from 'react-router-dom';
import EditAvailability from './routes/EditAvailability';
import ViewAvailability from './routes/ViewAvailability';
import Schedule from './routes/Schedule';
import Admin from './routes/Admin';
import Roles from './routes/Roles';
import Sheets from './routes/Sheets';
import Song from './routes/SheetsSong';
import SheetsSearch from './routes/SheetsSearch';

export default function App() {
  	return (
		<>
			<div className="navbar">
				<img className="navbar__img" src={logo}/>
				<div className="navbar__buttons">
					<NavLink exact to="/schedule" activeClassName="selected" className="navbar__button">Schedule</NavLink>
					<NavLink exact to="/" activeClassName="selected" className="navbar__button"
					isActive={(match, location) => {
						return ['/', '/availability'].includes(location.pathname);
					}}
					>Availability</NavLink>
                    <NavLink to="/sheets" activeClassName="selected" className="navbar__button">Sheets</NavLink>
				</div>
			</div>
			<Switch>
				<Route exact path="/" component={EditAvailability}/>
				<Route exact path="/availability" component={ViewAvailability}/>
				<Route exact path="/schedule" component={Schedule}/>
                <Route exact path="/admin" component={Admin}/>
                <Route exact path="/roles" component={Roles}/>
                <Route path="/sheets" component={Sheets}/>
                {/* <Route exact path="/sheets/song/:song" component={Song}/> */}
                {/* <Route exact path="/sheets/search" component={SheetsSearch}/> */}
			</Switch>
		</>

  	);
}
