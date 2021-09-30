import { useContext, useEffect, useState } from 'react';
import SettingsWindow from '../../components/SettingsWindow/SettingsWindow';
import { Pages } from '../../global/enums';
import { HomeTheme } from '../../global/MuiStyles';
import { Main } from '../../global/StyledComponents';
import { StyledButton, Title } from '../../global/StyledMui';
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
				<StyledButton label={'New Game'} navigate={Pages.NEWGAME} />
				<StyledButton label={'Join Game'} navigate={Pages.JOINGAME} />
				<StyledButton label={'Settings'} onClick={() => setShowSettings(true)} />
				{/* <StyledButton label={'Sample'} navigate={Pages.SAMPLE} /> */}
				<StyledButton label={'Logout'} onClick={logout} />
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
