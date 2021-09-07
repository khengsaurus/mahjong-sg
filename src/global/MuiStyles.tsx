import { blue, indigo } from '@material-ui/core/colors';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { useContext, useMemo } from 'react';
import { AppContext } from '../util/hooks/AppContext';
import { TextColors } from './enums';

export const HomeTheme = (props: any) => {
	const { mainTextColor } = useContext(AppContext);
	const highlightColor = useMemo(() => {
		return mainTextColor === TextColors.light ? blue[700] : indigo[500];
	}, [mainTextColor]);

	const theme = createTheme({
		overrides: {
			MuiInput: {
				underline: {
					'&&::before': {
						borderColor: mainTextColor
					},
					'&&:hover::before': {
						borderColor: highlightColor
					}
				}
			},
			MuiInputLabel: {
				shrink: {
					'&.MuiInputLabel-animated': {
						color: `${highlightColor} !important`
					}
				}
			},
			MuiButton: {
				root: {
					'&:hover': {
						backgroundColor: 'transparent !imporant',
						color: `${highlightColor} !important`
					}
				}
			},
			MuiIconButton: {
				root: {
					color: `${mainTextColor} !important`,
					'&:hover': {
						color: `${highlightColor} !important`
					}
				}
			},
			MuiListItem: {
				root: {
					color: mainTextColor,
					'&:hover': {
						backgroundColor: 'transparent !imporant',
						color: `${highlightColor} !important`
					}
				}
			}
		},
		palette: {
			primary: {
				main: mainTextColor
			},
			secondary: {
				main: highlightColor
			},
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
	const highlightColor = useMemo(() => {
		return tableTextColor === TextColors.light ? blue[700] : indigo[500];
	}, [tableTextColor]);

	const theme = createTheme({
		palette: {
			primary: {
				main: tableTextColor
			},
			secondary: {
				main: highlightColor
			},
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
