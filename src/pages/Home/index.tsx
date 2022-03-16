import { Fade } from '@mui/material';
import { DecorButton, JoinGameButton, LogoutButton, NewGameButton } from 'components/Buttons';
import SettingsWindow from 'components/SettingsWindow';
import { useDocumentListener } from 'hooks';
import HomePage from 'pages/Home/HomePage';
import { StyledButton } from 'style/StyledMui';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { EEvent, Shortcut, Transition } from 'enums';
import { ButtonText } from 'screenTexts';
import { IStore } from 'store';
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

	const SettingsButton: React.FC = () => {
		return <StyledButton label={ButtonText.SETTINGS} onClick={() => setShowSettings(true)} />;
	};

	const markup = () => (
		<>
			<DecorButton Button={NewGameButton} showOnHover={['we', '', 'ws']} />
			<DecorButton Button={JoinGameButton} showOnHover={['ws', '', 'ww']} />
			<DecorButton Button={SettingsButton} showOnHover={['ww', '', 'wn']} />
			<DecorButton Button={LogoutButton} showOnHover={['wn', '', 'we']} />
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

// ['sc', '', 'fm']
// ['sx', '', 'fl']
// ['sq', '', 'fj']
// ['sd', '', 'fl']
