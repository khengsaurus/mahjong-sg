import { createBrowserHistory } from 'history';
import Home from 'platform/pages/Home';
import JoinGame from 'platform/pages/JoinGame';
import Login from 'platform/pages/Login';
import NewUser from 'platform/pages/Login/NewUser';
import NewGame from 'platform/pages/NewGame';
import Sample from 'platform/pages/Sample';
import Table from 'platform/pages/Table';
import { Styled } from 'platform/style/StyledComponents';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { AppContextProvider } from 'shared/hooks';
import { persistor, store } from 'shared/store';
import './App.scss';

export const history = createBrowserHistory();

function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
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
								{/* <Route exact path="/Sample" component={Sample} /> */}
							</Switch>
						</Styled>
					</Router>
				</AppContextProvider>
			</PersistGate>
		</Provider>
	);
}

export default App;
