import { history } from 'App';
import SettingsWindow from 'platform/components/SettingsWindow/SettingsWindow';
import HomePage from 'platform/pages/Home/HomePage';
import { PlatformSpecs } from 'platform/style/StyledComponents';
import { StyledButton, Title } from 'platform/style/StyledMui';
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

	const Markup: React.FC = () => (
		<>
			<Title title={`Welcome ${user?.uN || ''}`} />
			<StyledButton label={'New Game'} navigate={Page.NEWGAME} />
			<StyledButton label={'Join Game'} navigate={Page.JOINGAME} />
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
		</>
	);

	return <HomePage Markup={Markup} />;
};

export default Home;
