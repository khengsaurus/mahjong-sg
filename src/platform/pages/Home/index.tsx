import { history } from 'App';
import SettingsWindow from 'platform/components/SettingsWindow/SettingsWindow';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Main, PlatformSpecs } from 'platform/style/StyledComponents';
import { JoinGameButton, StyledButton, Title } from 'platform/style/StyledMui';
import React, { useContext, useState } from 'react';
import { Page } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import './home.scss';

const Home = () => {
	const { user, logout } = useContext(AppContext);
	const [showSettings, setShowSettings] = useState(false);

	function handleLogout() {
		logout();
		history.push(Page.LOGIN);
	}

	return (
		<HomeTheme>
			<Main>
				<Title title={`Welcome ${user?.uN || ''}`} />
				<StyledButton label={'New Game'} navigate={Page.NEWGAME} />
				<JoinGameButton />
				<StyledButton label={'Settings'} onClick={() => setShowSettings(true)} />
				{process.env.REACT_APP_DEV_FLAG === '1' && <StyledButton label={'Sample'} navigate={Page.SAMPLE} />}
				<StyledButton label={'Logout'} onClick={handleLogout} />
				{process.env.REACT_APP_DEV_FLAG === '1' && (
					<PlatformSpecs>{`Platform: ${process.env.REACT_APP_PLATFORM}`}</PlatformSpecs>
				)}
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
};

export default Home;
