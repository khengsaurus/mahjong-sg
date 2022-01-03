import { history } from 'App';
import { useDocumentListener } from 'platform/hooks';
import { StyledButton } from 'platform/style/StyledMui';
import { useCallback } from 'react';
import { EEvent, Page, PageName, Shortcut } from 'shared/enums';
import { ButtonText } from 'shared/screenTexts';

interface ITextNavButton extends IHasStyle {
	label: PageName | ButtonText;
	route: Page;
	shortcut: Shortcut;
}

const TextNavButton = ({ label, shortcut, route, style = {} }: ITextNavButton) => {
	const handleShortcut = useCallback(
		e => {
			if (e.key === shortcut) {
				history.push(route);
			}
		},
		[shortcut, route]
	);
	useDocumentListener(EEvent.KEYDOWN, handleShortcut);

	return <StyledButton label={label} navigate={route} style={{ ...style }} />;
};

const HomeButton = ({ style = {}, label = PageName.HOME }: IHomeButton) => {
	return <TextNavButton label={label} route={Page.INDEX} shortcut={Shortcut.HOME} style={style} />;
};

const NewGameButton = ({ style = {} }: IHasStyle) => {
	return <TextNavButton label={PageName.NEWGAME} route={Page.NEWGAME} shortcut={Shortcut.NEWGAME} style={style} />;
};

const JoinGameButton = ({ style = {} }: IHasStyle) => {
	return <TextNavButton label={PageName.JOINGAME} route={Page.JOINGAME} shortcut={Shortcut.JOINGAME} style={style} />;
};

const AboutButton = ({ style = {} }: IHasStyle) => {
	return <TextNavButton label={PageName.ABOUT} route={Page.ABOUT} shortcut={null} style={style} />;
};

export { HomeButton, NewGameButton, JoinGameButton, AboutButton };
