import { Fade } from '@mui/material';
import LogoutButton from 'platform/components/Buttons/LogoutButton';
import { JoinGameButton, NewGameButton } from 'platform/components/Buttons/TextNavButton';
import SettingsWindow from 'platform/components/SettingsWindow/SettingsWindow';
import { PlatformSpecs } from 'platform/style/StyledComponents';
import { StyledButton, Title } from 'platform/style/StyledMui';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AppFlag, Transition } from 'shared/enums';
import { IStore } from 'shared/store';
import './home.scss';
import HomePage from './HomePage';

const Home = () => {
	const { user } = useSelector((state: IStore) => state);
	const [showSettings, setShowSettings] = useState(false);

	const markup = () => (
		<>
			<Title title={`Welcome${user?.uN ? `, ${user?.uN}` : ``}`} />
			<NewGameButton />
			<JoinGameButton />
			<StyledButton label={'Settings'} onClick={() => setShowSettings(true)} />
			<LogoutButton />
			{process.env.REACT_APP_FLAG.startsWith(AppFlag.DEV) && (
				<PlatformSpecs>{`Platform: ${process.env.REACT_APP_PLATFORM}`}</PlatformSpecs>
			)}
			<Fade in={showSettings} timeout={Transition.FAST} unmountOnExit>
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
