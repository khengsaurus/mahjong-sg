import { createBrowserHistory } from 'history';
import About from 'platform/pages/About';
import DataPolicy from 'platform/pages/DataPolicy';
import Home from 'platform/pages/Home';
import JoinGame from 'platform/pages/JoinGame';
import Login from 'platform/pages/Login';
import NewUser from 'platform/pages/Login/NewUser';
import NewGame from 'platform/pages/NewGame';
import Table from 'platform/pages/Table';
import { Styled } from 'platform/style/StyledComponents';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Page } from 'shared/enums';
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
								<Route exact path={Page.INDEX} component={Home} />
								<Route exact path={Page.HOME} component={Home} />
								<Route exact path={Page.LOGIN} component={Login} />
								<Route exact path={Page.NEWUSER} component={NewUser} />
								<Route exact path={Page.NEWGAME} component={NewGame} />
								<Route exact path={Page.JOINGAME} component={JoinGame} />
								<Route exact path={Page.TABLE} component={Table} />
								<Route exact path={Page.ABOUT} component={About} />
								<Route exact path={Page.PRIVACY} component={DataPolicy} />
							</Switch>
						</Styled>
					</Router>
				</AppContextProvider>
			</PersistGate>
		</Provider>
	);
}

export default App;
