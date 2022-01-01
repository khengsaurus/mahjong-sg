import { useSelector } from 'react-redux';
import { TextColor } from 'shared/enums';
import { IStore } from 'shared/store';
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
	transition: 300ms;
	color: ${props => props.theme.textColor};
`;

export const CenteredColored = styled(Centered)`
	background-color: ${props => props.theme.backgroundColor};
`;

export const CenteredTableColored = styled(Centered)`
	background-color: ${props => props.theme.tableColor};
`;

export const Scrollable = styled.div`
	width: 95vw;
	max-height: 85vh;
	text-align: left;
	overflow-y: scroll;
	::-webkit-scrollbar {
		display: none;
	}
	color: ${props => props.theme.mainTextColor};
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
	right: 0;
	bottom: 0;
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

export const PlatformSpecs = styled.div`
	position: absolute;
	display: flex;
	flex-direction: column;
	bottom: 5px;
	right: 5px;
	font-size: 10px;
	color: ${props => props.theme.mainTextColor};
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

export const TableText = styled.p`
	color: ${props => props.theme.tableTextColor};
	margin: 0px 5px;
`;

export const GreenTableText = styled.p`
	color: ${TextColor.GREEN};
	margin: 0px 5px;
`;

export const HiddenTile = styled.div`
	background-color: ${props => props.theme.tileColor || 'teal'};
`;

export const VerticalDivider = styled.div`
	position: relative;
	top: 5%;
	height: 80%;
	max-height: 180px;
	width: 1px;
	background-color: ${props => props.theme.mainTextColor};
`;

export const Column = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	transition: 300ms;
`;

export const Row = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	transition: 300ms;
`;

export const FormRow = styled(Row)`
	align-items: center;
	justify-content: flex-start;
	width: max-content;
`;
