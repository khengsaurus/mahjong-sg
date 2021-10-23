import { amber, blue, indigo, red, teal, yellow } from '@material-ui/core/colors';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { useContext, useMemo } from 'react';
import { BackgroundColors, TableColors, TextColors } from 'shared/enums';
import { AppContext } from 'shared/util/hooks/AppContext';

function getHighlightColor(color: TableColors | BackgroundColors) {
	if ([TableColors.DARK, BackgroundColors.DARK].includes(color)) {
		return blue[700];
	} else if ([TableColors.BROWN, BackgroundColors.BROWN].includes(color)) {
		return indigo[500];
	} else if ([TableColors.GREEN, BackgroundColors.GREEN].includes(color)) {
		return red[800];
	} else if ([TableColors.RED, BackgroundColors.RED].includes(color)) {
		return teal[700];
	} else if ([TableColors.PURPLE, BackgroundColors.PURPLE].includes(color)) {
		return amber[600];
	} else if ([TableColors.BLUE, BackgroundColors.BLUE].includes(color)) {
		return yellow[700];
	}
}

export const HomeTheme = (props: any) => {
	const { backgroundColor, mainTextColor } = useContext(AppContext);
	const theme = useMemo(() => {
		const highlightColor = getHighlightColor(backgroundColor);
		return newMuiTheme(backgroundColor, mainTextColor, highlightColor);
	}, [backgroundColor, mainTextColor]);

	return <ThemeProvider theme={theme} {...props} />;
};

export const TableTheme = (props: any) => {
	const { tableColor, tableTextColor } = useContext(AppContext);
	const theme = useMemo(() => {
		const highlightColor = getHighlightColor(tableColor);
		return newMuiTheme(tableColor, tableTextColor, highlightColor);
	}, [tableColor, tableTextColor]);

	return <ThemeProvider theme={theme} {...props} />;
};

function newMuiTheme(backgroundColor: BackgroundColors | TableColors, textColor: TextColors, highlightColor: string) {
	return createTheme({
		palette: {
			primary: {
				main: textColor
			},
			secondary: {
				main: highlightColor
			},
			text: {
				primary: textColor
			},
			action: {
				active: textColor,
				hover: highlightColor,
				disabled: 'grey'
			}
		},
		typography: {
			h6: {
				color: textColor
			},
			subtitle1: {
				color: textColor
			}
		},
		overrides: {
			MuiFormLabel: {
				root: {
					color: textColor
				}
			},
			MuiRadio: {
				root: {
					color: textColor
				}
			},
			MuiCheckbox: {
				root: {
					color: textColor
				}
			},
			MuiButtonBase: {
				root: {
					color: `${textColor}`,
					'&:hover': {
						color: process.env.REACT_APP_PLATFORM === 'web' ? `${highlightColor}` : `${textColor}`
					}
				}
			},
			MuiButton: {
				root: {
					color: `${textColor}`,
					'&:active': {
						backgroundColor: 'transparent !important'
					},
					'&:focus': {
						backgroundColor: 'transparent !important'
					},
					'&:hover': {
						backgroundColor: 'transparent !important',
						color: process.env.REACT_APP_PLATFORM === 'web' ? `${highlightColor}` : `${textColor}`
					}
				}
				// label: {
				// 	color: process.env.REACT_APP_PLATFORM === 'web' ? `${highlightColor}` : `${textColor}`
				// }
			},
			MuiIconButton: {
				colorInherit: {
					color: `${textColor}`
				},
				root: {
					color: `${textColor}`,
					'&:active': {
						backgroundColor: 'transparent !important'
					},
					'&:focus': {
						backgroundColor: 'transparent !important'
					},
					'&:hover': {
						backgroundColor: 'transparent !important',
						color: process.env.REACT_APP_PLATFORM === 'web' ? `${highlightColor}` : `${textColor}`
					}
				}
			},
			MuiDialog: {
				paper: {
					backgroundColor: backgroundColor,
					maxWidth: '420px !important',
					minWidth: '420px !important',
					overflow: 'scroll'
				}
			},
			MuiPopover: {
				paper: {
					backgroundColor: backgroundColor
				}
			},
			MuiInput: {
				underline: {
					'&&::before': {
						borderColor: textColor
					},
					'&&::after': {
						borderColor: highlightColor
					},
					'&&:hover::before': {
						borderColor: highlightColor
					}
				}
			},
			MuiInputLabel: {
				shrink: {
					'&.MuiInputLabel-animated': {
						color: `${textColor}`
					}
				}
			},
			MuiList: {
				root: {
					backgroundColor: backgroundColor
				},
				padding: {
					paddingTop: '0px',
					paddingBottom: '0px'
				}
			},
			MuiListItem: {
				root: {
					color: textColor,
					'&:hover': {
						backgroundColor: 'transparent !important'
						// color: process.env.REACT_APP_PLATFORM === 'web' ? `${highlightColor}` : `${textColor}`
					}
				},
				button: {
					'&:hover': {
						backgroundColor: 'transparent !important',
						color: `${highlightColor}`
					}
				}
			},
			MuiMenuItem: {
				root: {
					justifyContent: 'center',
					'&$selected': {
						backgroundColor: 'transparent !important'
					},
					'&:hover': {
						backgroundColor: 'transparent !important',
						color: process.env.REACT_APP_PLATFORM === 'web' ? `${highlightColor}` : `${textColor}`
					}
				}
			},
			MuiSelect: {
				select: {
					textAlign: 'center',
					paddingLeft: '12px !important',
					paddingRight: '12px !important',
					'&:focus': {
						backgroundColor: 'transparent !important'
					}
				}
			}
		}
	});
}

export const MuiStyles = {
	announce_hu_dialog: {
		minHeight: '120px',
		minWidth: '320px',
		maxWidth: '320px',
		justifyContent: 'center'
	},
	topRight5: {
		position: 'absolute',
		top: 5,
		right: 5
	},
	modal: {
		maxWidth: '420px',
		minWidth: '420px',
		overflow: 'scroll'
	},
	tabs: {
		borderRadius: 0,
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
	icon_button_top_right: {
		position: 'absolute',
		top: 5,
		right: 5
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
	},
	dropdown_select: {
		width: '50px'
	},
	dropdown_item: {
		width: '50px',
		height: '20px',
		minHeight: '20px',
		maxHeight: '20px',
		margin: '4px',
		justifyContent: 'center'
	}
};
