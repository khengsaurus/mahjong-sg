import { RedirectNotice } from 'components';
import { Page } from 'enums';
import { AppContextProvider } from 'hooks';
import {
	About,
	Help,
	Home,
	JoinGame,
	Login,
	NewGame,
	NewUser,
	Policy,
	Table
} from 'pages';
import { Provider } from 'react-redux';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from 'store';
import { Styled } from 'style/StyledComponents';
import './App.scss';

function App() {
	return (
		<HashRouter>
			{/* @ts-ignore */}
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<AppContextProvider>
						<Styled>
							<Routes>
								<Route path={Page.ABOUT} element={<About />} />
								<Route path={Page.INDEX} element={<Home />} />
								<Route path={Page.HELP} element={<Help />} />
								<Route path={Page.HOME} element={<Home />} />
								<Route path={Page.JOINGAME} element={<JoinGame />} />
								<Route path={Page.LOGIN} element={<Login />} />
								<Route path={Page.NEWUSER} element={<NewUser />} />
								<Route path={Page.NEWGAME} element={<NewGame />} />
								<Route path={Page.POLICY} element={<Policy />} />
								<Route path={Page.TABLE} element={<Table />} />
							</Routes>
							<RedirectNotice />
						</Styled>
					</AppContextProvider>
				</PersistGate>
			</Provider>
		</HashRouter>
	);
}

export default App;
