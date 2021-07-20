import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import Home from './pages/Home';
import JoinGame from './pages/JoinGame';
import NewGame from './pages/NewGame';
import Table from './pages/Table';
import { AppContextProvider } from './util/hooks/AppContext';
import store from './util/store/store';

export const history = createBrowserHistory();

function App() {
	return (
		<Provider store={store}>
			<AppContextProvider>
				<Router history={history}>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route exact path="/NewGame" component={NewGame} />
						<Route exact path="/Table" component={Table} />
						<Route exact path="/JoinGame" component={JoinGame} />
					</Switch>
				</Router>
			</AppContextProvider>
		</Provider>
	);
}

export default App;
