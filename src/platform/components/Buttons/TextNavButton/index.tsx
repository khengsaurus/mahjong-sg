import { useDocumentListener } from 'platform/hooks';
import { StyledButton } from 'platform/style/StyledMui';
import { useCallback, useContext } from 'react';
import { EEvent, Page, PageName, Shortcut } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { ButtonText } from 'shared/screenTexts';

export interface IHoverButton extends IHasStyle, IHasHoverProps {}

export interface ITextNavButtonP extends IHoverButton {
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
	onClick,
	disableShortcut = false,
	style = {},
	showOnHover = []
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

	return (
		<div
		// onMouseEnter={() => {
		// 	console.log('mouse enter');
		// }}
		// onMouseLeave={() => {
		// 	console.log('mouse leave');
		// }}
		>
			<StyledButton
				label={label}
				navigate={route}
				onClick={onClick}
				style={{ ...style }}
				showOnHover={showOnHover}
			/>
		</div>
	);
};

export default TextNavButton;
