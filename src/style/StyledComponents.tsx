import { TextColor, TransitionSpeed } from 'enums';
import { useSelector } from 'react-redux';
import { IStore } from 'store';
import styled, { ThemeProvider } from 'styled-components';

export const Styled = (props: any) => {
	const {
		theme: { backgroundColor, tableColor, tileColor, tableTextColor, mainTextColor }
	} = useSelector((state: IStore) => state);
	const colorTheme = {
		backgroundColor,
		tableColor,
		tileColor,
		tableTextColor,
		mainTextColor
	};

	// @ts-ignore
	return <ThemeProvider theme={colorTheme} {...props} />;
};

export const TableColoredDiv = styled.div`
	background-color: ${props => props.theme.tableColor};
`;

export const Centered = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	justify-self: center;
	align-items: center;
	align-self: center;
	text-align: center;
	transition: ${TransitionSpeed.FAST};
	color: ${props => props.theme.textColor};
`;

export const CenteredColored = styled(Centered)`
	background-color: ${props => props.theme.backgroundColor};
`;

export const CenteredTableColored = styled(Centered)`
	background-color: ${props => props.theme.tableColor};
`;

export const ScrollableBase = styled.div`
	overflow-y: scroll;
	scroll-behavior: smooth;
	color: ${props => props.theme.mainTextColor};
	::-webkit-scrollbar {
		display: none;
	}
`;

export const Notification = styled.div`
	position: absolute;
	border-radius: 4px; /* $default-border-radius; */
	padding: 20px;
	background-color: ${props => props.theme.backgroundColor};
`;

export const Main = styled(Centered)`
	position: fixed;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	font-family: 'Roboto', sans-serif;
	background-color: ${props => props.theme.backgroundColor};
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Safari */
	-khtml-user-select: none; /* Konqueror HTML */
	-moz-user-select: none; /* Old versions of Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
`;

export const MainTransparent = styled(Main)`
	background-color: transparent;
`;

export const NetworkAlert = styled.div`
	position: absolute;
	top: 0px;
	display: flex;
	flex-direction: row;
	height: 24px;
	padding: 2px 8px;
	margin-top: const(safe-area-inset-top);
	margin-top: env(safe-area-inset-top);
	color: ${props => props.theme.mainTextColor};
	background-color: ${props => props.theme.backgroundColor};
	transition: ${TransitionSpeed.FAST};
`;

export const BottomSpecs = styled.div`
	position: absolute;
	bottom: 0px;
	display: flex;
	flex-direction: row;
	height: 24px; // ref-bottom-home-buttons
	margin-bottom: const(safe-area-inset-bottom);
	margin-bottom: env(safe-area-inset-bottom);
	color: ${props => props.theme.mainTextColor};
	background-color: ${props => props.theme.backgroundColor};
	transition: ${TransitionSpeed.FAST};
`;

export const TableDiv = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-family: 'Roboto', sans-serif;
	background-color: ${props => props.theme.tableColor};
`;

export const Wind = styled.div`
	display: flex;
	flex-direction: column;
	font-family: 'Roboto', sans-serif;
	color: ${props => props.theme.backgroundColor};
`;

// Overriding these in Overlay for Android
export const OverlayBackground = styled.div`
	position: absolute;
	top: calc(10px + const(safe-area-inset-top));
	top: calc(10px + env(safe-area-inset-top));
	right: calc(6px + const(safe-area-inset-right));
	right: calc(6px + env(safe-area-inset-right));
	bottom: calc(10px + const(safe-area-inset-bottom));
	bottom: calc(10px + env(safe-area-inset-bottom));
	left: calc(6px + const(safe-area-inset-left));
	left: calc(6px + env(safe-area-inset-left));
	border: 2px solid transparent;
	background-color: transparent;
	border-color: ${props => props.theme.tableColor};
	transition: ${TransitionSpeed.FAST};
	z-index: -1;
`;

const OverlayDecor = styled.div`
	position: fixed;
	height: 60px;
	width: 60px;
	background-color: ${props => props.theme.backgroundColor};
	transition: ${TransitionSpeed.FAST};
	z-index: -1;
`;

// Overriding these in Overlay for Android
export const OverlayDecorTopLeft = styled(OverlayDecor)`
	transform: rotate(90deg);
	top: calc(10px + const(safe-area-inset-top));
	top: calc(10px + env(safe-area-inset-top));
	left: calc(6px + const(safe-area-inset-left));
	left: calc(6px + env(safe-area-inset-left));
`;

// Overriding these in Overlay for Android
export const OverlayDecorTopRight = styled(OverlayDecor)`
	transform: rotate(90deg);
	top: calc(10px + const(safe-area-inset-top));
	top: calc(10px + env(safe-area-inset-top));
	right: calc(6px + const(safe-area-inset-right));
	right: calc(6px + env(safe-area-inset-right));
`;

// Overriding these in Overlay for Android
export const OverlayDecorBottomLeft = styled(OverlayDecor)`
	transform: scaleX(-1) rotate(180deg);
	bottom: calc(10px + const(safe-area-inset-bottom));
	bottom: calc(10px + env(safe-area-inset-bottom));
	left: calc(6px + const(safe-area-inset-left));
	left: calc(6px + env(safe-area-inset-left));
`;

// Overriding these in Overlay for Android
export const OverlayDecorBottomRight = styled(OverlayDecor)`
	transform: rotate(270deg);
	bottom: calc(10px + const(safe-area-inset-bottom));
	bottom: calc(10px + env(safe-area-inset-bottom));
	right: calc(6px + const(safe-area-inset-right));
	right: calc(6px + env(safe-area-inset-right));
`;

export const TableText = styled.p`
	color: ${props => props.theme.tableTextColor};
	margin: 0px 5px;
`;

export const GreenTableText = styled.p`
	color: ${TextColor.GREEN};
	margin: 0px 5px;
	font: inherit;
`;

export const TileBack = styled.div`
	background-color: ${props => props.theme.tileColor || 'teal'};
`;

export const Column = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	transition: ${TransitionSpeed.FAST};
`;

export const Row = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	transition: ${TransitionSpeed.FAST};
`;

export const FormRow = styled(Row)`
	align-items: center;
	justify-content: flex-start;
	width: max-content;
`;
