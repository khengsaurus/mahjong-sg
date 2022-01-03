import { Fade } from '@mui/material';
import LogoutButton from 'platform/components/Buttons/LogoutButton';
import { AboutButton, JoinGameButton, NewGameButton } from 'platform/components/Buttons/TextNavButton';
import SettingsWindow from 'platform/components/SettingsWindow/SettingsWindow';
import { useDocumentListener } from 'platform/hooks';
import HomePage from 'platform/pages/Home/HomePage';
import { PlatformSpecs } from 'platform/style/StyledComponents';
import { StyledButton, StyledText } from 'platform/style/StyledMui';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppFlag, EEvent, Shortcut, Transition } from 'shared/enums';
import { ButtonText } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import './home.scss';

const Home = () => {
	const { user } = useSelector((state: IStore) => state);
	const [showSettings, setShowSettings] = useState(false);

	const handleKeyListeners = useCallback(
		e => {
			switch (e.key) {
				case Shortcut.SETTINGS:
					setShowSettings(show => !show);
					break;
				default:
					break;
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[setShowSettings]
	);
	useDocumentListener(EEvent.KEYDOWN, handleKeyListeners);

	const markup = () => (
		<>
			<StyledText title={`Welcome${user?.uN ? `, ${user?.uN}` : ``}`} />
			<NewGameButton />
			<JoinGameButton />
			<StyledButton label={ButtonText.SETTINGS} onClick={() => setShowSettings(true)} />
			<AboutButton />
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
