import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import { AppContextProvider } from 'shared/hooks/AppContext';
import store from 'shared/store';
import Home from 'web/pages/Home';
import JoinGame from 'web/pages/JoinGame';
import Login from 'web/pages/Login';
import NewUser from 'web/pages/Login/NewUser';
import NewGame from 'web/pages/NewGame';
import Sample from 'web/pages/Sample';
import Table from 'web/pages/Table';
import { Styled } from 'web/style/StyledComponents';
import './App.scss';

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
