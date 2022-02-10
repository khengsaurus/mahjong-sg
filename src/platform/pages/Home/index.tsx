import { Fade } from '@mui/material';
import LogoutButton from 'platform/components/Buttons/LogoutButton';
import { JoinGameButton, NewGameButton } from 'platform/components/Buttons/TextNavButton';
import SettingsWindow from 'platform/components/SettingsWindow';
import { useDocumentListener } from 'platform/hooks';
import HomePage from 'platform/pages/Home/HomePage';
import { StyledButton } from 'platform/style/StyledMui';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { EEvent, Shortcut, Transition } from 'shared/enums';
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
			<NewGameButton />
			<JoinGameButton />
			<StyledButton label={ButtonText.SETTINGS} onClick={() => setShowSettings(true)} />
			<LogoutButton />
			<Fade in={showSettings} timeout={Transition.FAST} unmountOnExit>
				<div>
					<SettingsWindow
						show={showSettings}
						accActions={true}
						onClose={() => {
							setShowSettings(false);
						}}
					/>
				</div>
			</Fade>
		</>
	);

	return <HomePage markup={markup} title={`Welcome${user?.uN ? `, ${user?.uN}` : ``}`} />;
};

export default Home;
