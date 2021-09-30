import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import './App.scss';
import { Styled } from './global/StyledComponents';
import Home from './pages/Home';
import JoinGame from './pages/JoinGame';
import Login from './pages/Login';
import NewUser from './pages/Login/NewUser';
import NewGame from './pages/NewGame';
import Sample from './pages/Sample';
import Table from './pages/Table';
import { AppContextProvider } from './util/hooks/AppContext';
import store from './util/store/store';

export const history = createBrowserHistory();

function App() {
	return (
		<Provider store={store}>
			<AppContextProvider>
				<Router history={history}>
					<Styled>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route exact path="/Home" component={Home} />
							<Route exact path="/Login" component={Login} />
							<Route exact path="/NewUser" component={NewUser} />
							<Route exact path="/NewGame" component={NewGame} />
							<Route exact path="/JoinGame" component={JoinGame} />
							<Route exact path="/Table" component={Table} />
							<Route exact path="/Sample" component={Sample} />
						</Switch>
					</Styled>
				</Router>
			</AppContextProvider>
		</Provider>
	);
}

export default App;
