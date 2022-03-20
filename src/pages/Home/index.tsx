import {
	CustomFade,
	DecorButton,
	JoinGameButton,
	LogoutButton,
	NewGameButton,
	SettingsWindow
} from 'components';
import { EEvent, Shortcut, Transition } from 'enums';
import { useDocumentListener } from 'hooks';
import { HomePage } from 'pages';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { ButtonText } from 'screenTexts';
import { IStore } from 'store';
import { StyledButton } from 'style/StyledMui';
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
		return (
			<StyledButton
				label={ButtonText.SETTINGS}
				onClick={() => setShowSettings(true)}
			/>
		);
	};

	const markup = () => (
		<>
			<DecorButton Button={NewGameButton} showOnHover={['we', '', 'ws']} />
			<DecorButton Button={JoinGameButton} showOnHover={['ws', '', 'ww']} />
			<DecorButton Button={SettingsButton} showOnHover={['ww', '', 'wn']} />
			<DecorButton Button={LogoutButton} showOnHover={['wn', '', 'we']} />
			<CustomFade show={showSettings} timeout={Transition.FAST}>
				<SettingsWindow
					show={showSettings}
					accActions={true}
					onClose={() => setShowSettings(false)}
				/>
			</CustomFade>
		</>
	);

	return (
		<HomePage markup={markup} title={`Welcome${user?.uN ? `, ${user?.uN}` : ``}`} />
	);
};

export default Home;

// ['sc', '', 'fm']
// ['sx', '', 'fl']
// ['sq', '', 'fj']
// ['sd', '', 'fl']
