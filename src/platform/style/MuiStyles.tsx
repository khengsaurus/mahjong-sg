import { amber, blue, indigo, red, teal, yellow } from '@material-ui/core/colors';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { useContext, useMemo } from 'react';
import { BackgroundColor, TableColor, TextColor } from 'shared/enums';
import { AppContext } from 'shared/hooks';

function getHighlightColor(color: TableColor | BackgroundColor) {
	if ([TableColor.DARK, BackgroundColor.DARK].includes(color)) {
		return blue[700];
	} else if ([TableColor.BROWN, BackgroundColor.BROWN].includes(color)) {
		return indigo[500];
	} else if ([TableColor.GREEN, BackgroundColor.GREEN].includes(color)) {
		return red[500];
	} else if ([TableColor.RED, BackgroundColor.RED].includes(color)) {
		return teal[500];
	} else if ([TableColor.PURPLE, BackgroundColor.PURPLE].includes(color)) {
		return amber[600];
	} else if ([TableColor.BLUE, BackgroundColor.BLUE].includes(color)) {
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

function newMuiTheme(backgroundColor: BackgroundColor | TableColor, textColor: TextColor, highlightColor: string) {
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
					overflow: 'hidden',
					overflowX: 'hidden',
					overflowY: 'hidden',
					userSelect: 'none',
					backgroundColor
				}
			},
			MuiDialogContent: {
				root: {
					padding: '14px 18px',
					userSelect: 'none',
					'&:first-child': {
						paddingTop: null
					}
				}
			},
			MuiPopover: {
				paper: {
					backgroundColor
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
					backgroundColor
				},
				padding: {
					paddingTop: '0px',
					paddingBottom: '0px'
				}
			},
			MuiTypography: {
				root: {
					color: textColor
				},
				colorTextPrimary: {
					color: `${textColor}`
				},
				colorTextSecondary: {
					color: `${textColor}`
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
			},
			MuiFormControlLabel: {
				root: {
					margin: '0px'
				},
				labelPlacementStart: {
					marginLeft: '0px'
				}
			}
		}
	});
}

export const MuiStyles = {
	large_dialog: {
		maxWidth: '385px',
		minWidth: '385px',
		maxHeight: '340px'
	},
	small_dialog: {
		minHeight: '120px',
		minWidth: '240px',
		maxWidth: '360px'
	},
	topRight5: {
		position: 'absolute',
		top: 5,
		right: 5
	},
	modal: {
		maxWidth: '385px',
		minWidth: '385px',
		overflow: 'scroll'
	},
	tabs: {
		borderRadius: 0,
		maxWidth: '240px',
		height: '30px'
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
		fontSize: 18,
		fontWeight: 600
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
		width: '50px',
		maxHeight: '28px'
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
