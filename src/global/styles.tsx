import { createTheme } from '@material-ui/core/styles';
import { useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { AppContext } from '../util/hooks/AppContext';

export const Styled = (props: any) => {
	const { backgroundColor, tableColor, tileBackColor } = useContext(AppContext);
	const theme = {
		backgroundColor: backgroundColor,
		tableColor: tableColor,
		tileBackColor: tileBackColor
	};
	return <ThemeProvider theme={theme} {...props} />;
};

export const TableColoredDiv = styled.div`
	background-color: ${props => props.theme.tableColor};
`;

export const Centered = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
`;

export const CenteredColored = styled(Centered)`
	background-color: ${props => props.theme.backgroundColor};
`;

export const Main = styled(Centered)`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	background-color: ${props => props.theme.backgroundColor};
`;

export const MainTransparent = styled(Main)`
	background-color: transparent;
`;

export const TableDiv = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	height: 100%;
	width: 100%;
	max-height: 750px;
	max-width: 750px;
	background-color: ${props => props.theme.tableColor};
`;

export const Wind = styled.div`
	display: flex;
	flex-direction: column;
	color: ${props => props.theme.backgroundColor};
`;

export const HiddenTile = styled.div`
	background-color: ${props => props.theme.tileBackColor};
`;

export const rotatedMUIDialog = createTheme({
	overrides: {
		MuiDialog: {
			root: {
				transform: 'rotate(90deg)'
			}
		}
	}
});

export const rotatedMUIButton = createTheme({
	overrides: {
		MuiButton: {
			root: {
				transform: 'rotate(90deg)'
			}
		}
	}
});

export const MuiStyles = {
	dialog: {
		minHeight: '120px',
		justifyContent: 'center'
	},
	topRight5: {
		position: 'absolute',
		top: 5,
		right: 5
	},
	modal: {
		maxWidth: '400px',
		minWidth: '400px',
		maxHeight: '300px',
		minHeight: '300px',
		overflow: 'scroll'
	},
	tabs: {
		borderRadius: 0,
		// minWidth: '250px',
		maxWidth: '250px',
		minHeight: '30px',
		maxHeight: '30px'
		// padding: '5px'
	},
	tabOptions: {
		flex: 1,
		// minWidth: '80px',
		// maxWidth: '80px',
		minHeight: '30px',
		maxHeight: '30px'
	},
	tabColorOptions: {
		minWidth: '38px',
		maxWidth: '38px',
		minHeight: '30px',
		maxHeight: '30px'
	}
};
