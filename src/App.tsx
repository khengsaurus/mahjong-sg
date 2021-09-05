import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import Home from './pages/Home';
import JoinGame from './pages/JoinGame';
import NewUser from './pages/Login/NewUser';
import Login from './pages/Login';
import NewGame from './pages/NewGame';
import Table from './pages/Table';
import { AppContextProvider } from './util/hooks/AppContext';
import store from './util/store/store';
import { Styled } from './global/StyledComponents';

export const history = createBrowserHistory();

function App() {
	return (
		<Provider store={store}>
			<AppContextProvider>
				<Styled>
					<Router history={history}>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route exact path="/Home" component={Home} />
							<Route exact path="/Login" component={Login} />
							<Route exact path="/NewUser" component={NewUser} />
							<Route exact path="/NewGame" component={NewGame} />
							<Route exact path="/JoinGame" component={JoinGame} />
							<Route exact path="/Table" component={Table} />
						</Switch>
					</Router>
				</Styled>
			</AppContextProvider>
		</Provider>
	);
}

export default App;
