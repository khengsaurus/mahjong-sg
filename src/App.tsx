import Home from 'platform/pages/Home';
import JoinGame from 'platform/pages/JoinGame';
import Login from 'platform/pages/Login';
import NewUser from 'platform/pages/Login/NewUser';
import { About, Help, Policy } from 'platform/pages/Misc';
import NewGame from 'platform/pages/NewGame';
import Table from 'platform/pages/Table';
import { Styled } from 'platform/style/StyledComponents';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Page } from 'shared/enums';
import { AppContextProvider } from 'shared/hooks';
import { persistor, store } from 'shared/store';
import './App.scss';

function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Styled>
					<BrowserRouter>
						<AppContextProvider>
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
						</AppContextProvider>
					</BrowserRouter>
				</Styled>
			</PersistGate>
		</Provider>
	);
}

export default App;
