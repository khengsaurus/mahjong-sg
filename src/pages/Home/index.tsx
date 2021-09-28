import { useContext, useEffect, useState } from 'react';
import SettingsWindow from '../../components/SettingsWindow/SettingsWindow';
import { Pages } from '../../global/enums';
import { HomeTheme } from '../../global/MuiStyles';
import { Main, StyledButton, Title } from '../../global/StyledComponents';
import { AppContext } from '../../util/hooks/AppContext';
import Login from '../Login';
import './home.scss';

const Home = () => {
	const { user, handleUserState, logout } = useContext(AppContext);
	const [showSettings, setShowSettings] = useState(false);

	useEffect(() => {
		if (!user) {
			handleUserState();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let markup = (
		<HomeTheme>
			<Main>
				{user && <Title title={`Welcome ${user.username}`} />}
				<StyledButton title={'New Game'} navigate={Pages.newGame} />
				<StyledButton title={'Join Game'} navigate={Pages.joinGame} />
				<StyledButton title={'Settings'} onClick={() => setShowSettings(true)} />
				{/* <StyledButton title={'Sample'} navigate={Pages.sample} /> */}
				<StyledButton title={'Logout'} onClick={logout} />
				{showSettings && (
					<SettingsWindow
						show={showSettings}
						onClose={() => {
							setShowSettings(false);
						}}
					/>
				)}
			</Main>
		</HomeTheme>
	);

	return user ? markup : <Login />;
};

export default Home;
