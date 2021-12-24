import { Fade } from '@mui/material';
import { history } from 'App';
import { JoinGameButton, NewGameButton } from 'platform/components/Buttons/TextNavButton';
import SettingsWindow from 'platform/components/SettingsWindow/SettingsWindow';
import { PlatformSpecs } from 'platform/style/StyledComponents';
import { StyledButton, Title } from 'platform/style/StyledMui';
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppFlag, Page, Timeout } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { IStore } from 'shared/store';
import './home.scss';
import HomePage from './HomePage';

const Home = () => {
	const { user } = useSelector((state: IStore) => state);
	const { logout } = useContext(AppContext);
	const [showSettings, setShowSettings] = useState(false);

	function handleLogout() {
		logout();
		history.push(Page.LOGIN);
	}

	const markup = () => (
		<>
			<Title title={`Welcome${user?.uN ? `, ${user?.uN}` : ``}`} />
			<NewGameButton />
			<JoinGameButton />
			<StyledButton label={'Settings'} onClick={() => setShowSettings(true)} />
			{/* {process.env.REACT_APP_FLAG === AppFlag.DEV && <StyledButton label={'Sample'} navigate={Page.SAMPLE} />} */}
			<StyledButton label={'Logout'} onClick={handleLogout} />
			{process.env.REACT_APP_FLAG === AppFlag.DEV && (
				<PlatformSpecs>{`Platform: ${process.env.REACT_APP_PLATFORM}`}</PlatformSpecs>
			)}
			<Fade in={showSettings} timeout={Timeout.FAST} unmountOnExit>
				<div>
					<SettingsWindow
						show={showSettings}
						onClose={() => {
							setShowSettings(false);
						}}
					/>
				</div>
			</Fade>
		</>
	);

	return <HomePage markup={markup} />;
};

export default Home;
