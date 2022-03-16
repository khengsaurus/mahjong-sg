import { useDocumentListener } from 'hooks';
import { StyledButton } from 'style/StyledMui';
import { useCallback, useContext } from 'react';
import { EEvent, Page, PageName, Shortcut } from 'enums';
import { AppContext } from 'hooks';
import { ButtonText } from 'screenTexts';

export interface ITextNavButtonP extends IHasStyle {
	label: PageName | ButtonText;
	route?: Page;
	shortcut?: Shortcut;
	disableShortcut?: boolean;
	onClick?: () => void;
}

const TextNavButton: React.FC<ITextNavButtonP> = ({
	label,
	route,
	shortcut,
	onClick,
	style = {},
	disableShortcut = false
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

	return <StyledButton label={label} navigate={route} onClick={onClick} style={{ zIndex: 10, ...style }} />;
};

export const HomeButton: React.FC<IHomeButtonP> = ({
	style = {},
	label = PageName.HOME,
	disableShortcut = false,
	callback = null
}: IHomeButtonP) => {
	const { handleHome } = useContext(AppContext);

	return (
		<TextNavButton
			label={label}
			onClick={() => (callback ? callback() : handleHome())}
			shortcut={Shortcut.HOME}
			disableShortcut={disableShortcut}
			style={style}
		/>
	);
};

export const BackButton: React.FC<IHomeButtonP> = ({ style = {}, callback = null }: IHomeButtonP) => {
	const { navigate } = useContext(AppContext);
	return (
		<TextNavButton
			label={ButtonText.BACK}
			onClick={() => (!!callback ? callback() : navigate(-1))}
			style={style}
			disableShortcut={true}
		/>
	);
};

export const NewGameButton: React.FC<IHasStyle> = ({ style = {} }: IHasStyle) => {
	return <TextNavButton label={PageName.NEWGAME} route={Page.NEWGAME} shortcut={Shortcut.NEWGAME} style={style} />;
};

export const JoinGameButton: React.FC<IHasStyle> = ({ style = {} }: IHasStyle) => {
	return <TextNavButton label={PageName.JOINGAME} route={Page.JOINGAME} shortcut={Shortcut.JOINGAME} style={style} />;
};

export const PrivacyButton: React.FC<IHasStyle> = ({ style = {} }: IHasStyle) => {
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

export const AboutButton: React.FC<IHasStyle> = ({ style = {} }: IHasStyle) => {
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

export const HelpButton: React.FC<IHasStyle> = ({ style = {} }: IHasStyle) => {
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

export default TextNavButton;
