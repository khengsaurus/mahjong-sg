import { history } from 'App';
import { useDocumentListener } from 'platform/hooks';
import { StyledButton } from 'platform/style/StyledMui';
import { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EEvent, Page, PageName, Shortcut } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { ButtonText } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { setGame, setGameId, setLocalGame, setTHK } from 'shared/store/actions';

interface TextNavButtonProps extends IHasStyle {
	label: PageName | ButtonText;
	route?: Page;
	shortcut?: Shortcut;
	disableShortcut?: boolean;
	onClick?: () => void;
}

const TextNavButton = ({
	label,
	route,
	shortcut,
	disableShortcut = false,
	style = {},
	onClick
}: TextNavButtonProps) => {
	const handleShortcut = useCallback(
		e => {
			if (e.key === shortcut) {
				onClick ? onClick() : history.push(route);
			}
		},
		[shortcut, route, onClick]
	);
	useDocumentListener(EEvent.KEYDOWN, disableShortcut ? null : handleShortcut);

	return <StyledButton label={label} navigate={route} onClick={onClick} style={{ ...style }} />;
};

const HomeButton = ({ style = {}, label = PageName.HOME, disableShortcut = false }: IHomeButton) => {
	const dispatch = useDispatch();
	const { user } = useSelector((store: IStore) => store);
	const { setPlayers } = useContext(AppContext);

	const handleNav = useCallback(() => {
		setPlayers([user]);
		dispatch(setGameId(''));
		dispatch(setTHK(111));
		dispatch(setGame(null));
		dispatch(setLocalGame(null));
		if (!user) {
			history.push(Page.LOGIN);
		} else {
			history.push(Page.INDEX);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, setPlayers, user?.id]);

	return (
		<TextNavButton
			label={label}
			onClick={handleNav}
			shortcut={Shortcut.HOME}
			style={style}
			disableShortcut={disableShortcut}
		/>
	);
};

const NewGameButton = ({ style = {} }: IHasStyle) => {
	return <TextNavButton label={PageName.NEWGAME} route={Page.NEWGAME} shortcut={Shortcut.NEWGAME} style={style} />;
};

const JoinGameButton = ({ style = {} }: IHasStyle) => {
	return <TextNavButton label={PageName.JOINGAME} route={Page.JOINGAME} shortcut={Shortcut.JOINGAME} style={style} />;
};

const PrivacyButton = ({ style = {} }: IHasStyle) => {
	return (
		<TextNavButton
			label={ButtonText.DATA}
			route={Page.PRIVACY}
			shortcut={null}
			disableShortcut={true}
			style={{ ...style, fontSize: 12, padding: 0 }}
		/>
	);
};

const AboutButton = ({ style = {} }: IHasStyle) => {
	return (
		<TextNavButton
			label={ButtonText.ABOUT}
			route={Page.ABOUT}
			shortcut={null}
			disableShortcut={true}
			style={{ ...style, fontSize: 12, padding: 0 }}
		/>
	);
};

const HelpButton = ({ style = {} }: IHasStyle) => {
	return (
		<TextNavButton
			label={ButtonText.HELP}
			route={Page.HELP}
			shortcut={null}
			disableShortcut={true}
			style={{ ...style, fontSize: 12, padding: 0 }}
		/>
	);
};

export { AboutButton, HelpButton, HomeButton, JoinGameButton, NewGameButton, PrivacyButton, TextNavButton };
