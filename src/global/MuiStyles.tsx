import { blue } from '@material-ui/core/colors';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { useContext } from 'react';
import { AppContext } from '../util/hooks/AppContext';

export const HomeTheme = (props: any) => {
	const { mainTextColor } = useContext(AppContext);
	const theme = createTheme({
		overrides: {
			MuiInput: {
				underline: {
					'&&:hover::before': {
						borderColor: mainTextColor
					}
				}
			}
		},
		palette: {
			primary: {
				main: mainTextColor
			},
			secondary: blue,
			text: {
				primary: mainTextColor
			}
		},
		typography: {
			h6: {
				color: mainTextColor
			},
			subtitle1: {
				color: mainTextColor
			}
		}
	});
	return <ThemeProvider theme={theme} {...props} />;
};

export const TableTheme = (props: any) => {
	const { tableTextColor } = useContext(AppContext);
	const theme = createTheme({
		palette: {
			primary: {
				main: tableTextColor
			},
			secondary: blue,
			text: {
				primary: tableTextColor
			}
		}
	});
	return <ThemeProvider theme={theme} {...props} />;
};

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
		// minWidth: '240px',
		maxWidth: '240px',
		minHeight: '30px',
		maxHeight: '30px'
	},
	tabOptions: {
		minWidth: '80px',
		maxWidth: '80px',
		minHeight: '30px',
		maxHeight: '30px'
	},
	tabColorOptions: {
		minWidth: '40px',
		maxWidth: '40px',
		minHeight: '30px',
		maxHeight: '30px'
	},
	buttons_small: {
		fontSize: 16,
		fontWeight: 500
	},
	buttons_medium: {
		fontSize: 20,
		fontWeight: 650
	},
	buttons_large: {
		fontSize: 26,
		fontWeight: 800
	}
};
