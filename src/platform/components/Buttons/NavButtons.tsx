import TextNavButton, { IHoverButton } from 'platform/components/Buttons/TextNavButton';
import { useContext } from 'react';
import { Page, PageName, Shortcut } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { ButtonText } from 'shared/screenTexts';

const HomeButton = ({
	style = {},
	label = PageName.HOME,
	disableShortcut = false,
	callback = null,
	showOnHover = []
}: IHomeButtonP) => {
	const { handleHome } = useContext(AppContext);

	return (
		<TextNavButton
			label={label}
			onClick={() => (callback ? callback() : handleHome())}
			shortcut={Shortcut.HOME}
			disableShortcut={disableShortcut}
			style={style}
			showOnHover={showOnHover}
		/>
	);
};

const BackButton = ({ style = {}, callback = null, showOnHover = [] }: IHomeButtonP) => {
	const { navigate } = useContext(AppContext);
	return (
		<TextNavButton
			label={ButtonText.BACK}
			onClick={() => (!!callback ? callback() : navigate(-1))}
			style={style}
			disableShortcut={true}
			showOnHover={showOnHover}
		/>
	);
};

const NewGameButton = ({ style = {}, showOnHover = [] }: IHoverButton) => {
	return (
		<TextNavButton
			label={PageName.NEWGAME}
			route={Page.NEWGAME}
			shortcut={Shortcut.NEWGAME}
			style={style}
			showOnHover={showOnHover}
		/>
	);
};

const JoinGameButton = ({ style = {}, showOnHover = [] }: IHoverButton) => {
	return (
		<TextNavButton
			label={PageName.JOINGAME}
			route={Page.JOINGAME}
			shortcut={Shortcut.JOINGAME}
			style={style}
			showOnHover={showOnHover}
		/>
	);
};

const PrivacyButton = ({ style = {}, showOnHover = [] }: IHoverButton) => {
	return (
		<TextNavButton
			label={ButtonText.POLICY}
			route={Page.POLICY}
			shortcut={null}
			disableShortcut={true}
			style={{ ...style, fontSize: 12, padding: 0 }}
			showOnHover={showOnHover}
		/>
	);
};

const AboutButton = ({ style = {}, showOnHover = [] }: IHoverButton) => {
	return (
		<TextNavButton
			label={ButtonText.ABOUT}
			route={Page.ABOUT}
			shortcut={null}
			disableShortcut={true}
			style={{ ...style, fontSize: 12, padding: 0 }}
			showOnHover={showOnHover}
		/>
	);
};

const HelpButton = ({ style = {}, showOnHover = [] }: IHoverButton) => {
	return (
		<TextNavButton
			label={ButtonText.HELP}
			route={Page.HELP}
			shortcut={null}
			disableShortcut={true}
			style={{ ...style, fontSize: 12, padding: 0 }}
			showOnHover={showOnHover}
		/>
	);
};

export { HomeButton, BackButton, NewGameButton, JoinGameButton, PrivacyButton, AboutButton, HelpButton };
