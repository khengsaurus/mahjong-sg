import { useDocumentListener } from 'platform/hooks';
import { StyledButton } from 'platform/style/StyledMui';
import { useCallback, useContext } from 'react';
import { EEvent, Page, PageName, Shortcut } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { ButtonText } from 'shared/screenTexts';

interface ITextNavButtonP extends IHasStyle {
	label: PageName | ButtonText;
	route?: Page;
	shortcut?: Shortcut;
	disableShortcut?: boolean;
	onClick?: () => void;
}

export const TextNavButton = ({
	label,
	route,
	shortcut,
	disableShortcut = false,
	style = {},
	onClick
}: ITextNavButtonP) => {
	const { navigate } = useContext(AppContext);
	const handleShortcut = useCallback(
		e => {
			if (e.key === shortcut) {
				onClick ? onClick() : navigate(route);
			}
		},
		[shortcut, route, navigate, onClick]
	);
	useDocumentListener(EEvent.KEYDOWN, disableShortcut ? null : handleShortcut);

	return <StyledButton label={label} navigate={route} onClick={onClick} style={{ ...style }} />;
};

export const HomeButton = ({
	style = {},
	label = PageName.HOME,
	disableShortcut = false,
	callback = null
}: IHomeButton) => {
	const { handleHome } = useContext(AppContext);

	return (
		<TextNavButton
			label={label}
			onClick={() => (callback ? callback() : handleHome())}
			shortcut={Shortcut.HOME}
			style={style}
			disableShortcut={disableShortcut}
		/>
	);
};

export const BackButton = ({ style = {}, label = ButtonText.BACK, disableShortcut = true }: IHomeButton) => {
	const { navigate } = useContext(AppContext);
	return <TextNavButton label={label} onClick={() => navigate(-1)} style={style} disableShortcut={true} />;
};

export const NewGameButton = ({ style = {} }: IHasStyle) => {
	return <TextNavButton label={PageName.NEWGAME} route={Page.NEWGAME} shortcut={Shortcut.NEWGAME} style={style} />;
};

export const JoinGameButton = ({ style = {} }: IHasStyle) => {
	return <TextNavButton label={PageName.JOINGAME} route={Page.JOINGAME} shortcut={Shortcut.JOINGAME} style={style} />;
};

export const PrivacyButton = ({ style = {} }: IHasStyle) => {
	return (
		<TextNavButton
			label={ButtonText.POLICY}
			route={Page.POLICY}
			shortcut={null}
			disableShortcut={true}
			style={{ ...style, fontSize: 12, padding: 0 }}
		/>
	);
};

export const AboutButton = ({ style = {} }: IHasStyle) => {
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

export const HelpButton = ({ style = {} }: IHasStyle) => {
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
