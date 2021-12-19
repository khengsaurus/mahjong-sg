import { useCallback, useEffect } from 'react';
import { Page, PageName, Shortcut } from 'shared/enums';
import { history } from 'App';
import { StyledButton } from 'platform/style/StyledMui';

interface ITextNavButton extends IHasStyle {
	label: PageName;
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

	useEffect(() => {
		document.addEventListener('keydown', handleShortcut);
		return () => {
			document.removeEventListener('keydown', handleShortcut);
		};
	}, [handleShortcut]);

	return <StyledButton label={label} navigate={route} style={{ ...style }} />;
};

const HomeButton = ({ style = {} }: IHasStyle) => {
	return <TextNavButton label={PageName.HOME} route={Page.INDEX} shortcut={Shortcut.HOME} style={style} />;
};

const NewGameButton = ({ style = {} }: IHasStyle) => {
	return <TextNavButton label={PageName.NEWGAME} route={Page.NEWGAME} shortcut={Shortcut.NEWGAME} style={style} />;
};

const JoinGameButton = ({ style = {} }: IHasStyle) => {
	return <TextNavButton label={PageName.JOINGAME} route={Page.JOINGAME} shortcut={Shortcut.JOINGAME} style={style} />;
};

export { HomeButton, NewGameButton, JoinGameButton };
