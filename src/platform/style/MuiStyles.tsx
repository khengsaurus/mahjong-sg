import { amber, blue, indigo, red, teal, yellow } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BackgroundColor, TableColor, TextColor } from 'shared/enums';
import { IStore } from 'shared/store';

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
	} else {
		return yellow[700];
	}
}

export const HomeTheme = (props: any) => {
	const {
		theme: { backgroundColor = BackgroundColor.BLUE, mainTextColor = TextColor.LIGHT }
	} = useSelector((state: IStore) => state);
	const _theme = useMemo(() => {
		const highlightColor = getHighlightColor(backgroundColor);
		return newMuiTheme(backgroundColor, mainTextColor, highlightColor);
	}, [backgroundColor, mainTextColor]);

	return <ThemeProvider theme={_theme} {...props} />;
};

export const TableTheme = (props: any) => {
	const {
		theme: { tableColor = BackgroundColor.GREEN, tableTextColor = TextColor.DARK }
	} = useSelector((state: IStore) => state);
	const _theme = useMemo(() => {
		const highlightColor = getHighlightColor(tableColor);
		return newMuiTheme(tableColor, tableTextColor, highlightColor);
	}, [tableColor, tableTextColor]);

	return <ThemeProvider theme={_theme} {...props} />;
};

function newMuiTheme(backgroundColor: BackgroundColor | TableColor, textColor: TextColor, highlightColor: string) {
	return createTheme({
		palette: {
			primary: { main: textColor },
			secondary: { main: highlightColor },
			text: { primary: textColor },
			action: { active: textColor, hover: highlightColor, disabled: 'grey' }
		},
		typography: {
			body1: { color: textColor },
			body2: { color: textColor },
			h6: { color: textColor },
			subtitle1: { color: textColor },
			subtitle2: { color: textColor }
		},

		components: {
			MuiButtonBase: {
				styleOverrides: {
					root: {
						color: `${textColor}`,
						'&:hover': {
							color: process.env.REACT_APP_PLATFORM === 'web' ? `${highlightColor}` : `${textColor}`
						}
					}
				}
			},
			MuiButton: {
				styleOverrides: {
					root: {
						color: `${textColor}`,
						backgroundColor: 'transparent !important',
						'&:hover': {
							color: process.env.REACT_APP_PLATFORM === 'web' ? `${highlightColor}` : `${textColor}`
						}
					}
				}
			},
			MuiCheckbox: {
				styleOverrides: {
					root: {
						color: textColor,
						backgroundColor: 'transparent !important'
					}
				}
			},
			MuiDialog: {
				styleOverrides: {
					paper: {
						overflow: 'hidden',
						overflowX: 'hidden',
						overflowY: 'hidden',
						userSelect: 'none',
						backgroundColor
					}
				}
			},
			MuiDialogContent: {
				styleOverrides: {
					root: {
						padding: '14px 18px',
						userSelect: 'none',
						'&:first-child': { paddingTop: null }
					}
				}
			},
			MuiFormLabel: {
				styleOverrides: {
					root: { color: textColor }
				}
			},
			MuiFormControlLabel: {
				styleOverrides: {
					root: { margin: '0px' },
					labelPlacementStart: { marginLeft: '0px' }
				}
			},
			MuiIconButton: {
				styleOverrides: {
					colorInherit: { color: `${textColor}` },
					root: {
						color: `${textColor}`,
						backgroundColor: 'transparent !important',
						'&:hover': {
							color: process.env.REACT_APP_PLATFORM === 'web' ? `${highlightColor}` : `${textColor}`
						}
					}
				}
			},
			MuiInput: {
				styleOverrides: {
					underline: {
						'&&::before': { borderColor: textColor },
						'&&::after': { borderColor: highlightColor },
						'&&:hover::before': { borderColor: highlightColor }
					}
				}
			},
			MuiInputLabel: {
				styleOverrides: {
					shrink: {
						'&.MuiInputLabel-animated': { color: `${textColor}` }
					}
				}
			},
			MuiList: {
				styleOverrides: {
					root: { backgroundColor },
					padding: {
						paddingTop: '0px',
						paddingBottom: '0px'
					}
				}
			},
			MuiListItem: {
				styleOverrides: {
					root: {
						color: textColor,
						backgroundColor: 'transparent !important'
					},
					button: {
						'&:hover': {
							color: process.env.REACT_APP_PLATFORM === 'web' ? `${highlightColor}` : `${textColor}`
						}
					}
				}
			},
			MuiListItemText: {
				styleOverrides: {
					root: { color: textColor },
					primary: { color: textColor },
					secondary: { color: textColor }
				}
			},
			MuiTypography: {
				styleOverrides: {
					root: {
						color: textColor
					}
				}
			},
			MuiMenuItem: {
				styleOverrides: {
					root: {
						justifyContent: 'center',
						backgroundColor: 'transparent !important',
						'&:hover': {
							color: process.env.REACT_APP_PLATFORM === 'web' ? `${highlightColor}` : `${textColor}`
						}
					}
				}
			},
			MuiPopover: {
				styleOverrides: {
					paper: { backgroundColor }
				}
			},
			MuiRadio: {
				styleOverrides: {
					root: {
						color: textColor,
						backgroundColor: 'transparent !important'
					}
				}
			},
			MuiSelect: {
				styleOverrides: {
					select: {
						textAlign: 'center',
						paddingLeft: '12px !important',
						paddingRight: '12px !important',
						backgroundColor: 'transparent !important',
						'&:hover': {
							color: process.env.REACT_APP_PLATFORM === 'web' ? `${highlightColor}` : `${textColor}`
						}
					}
				}
			},
			MuiTab: {
				styleOverrides: {
					root: { color: `${textColor}` }
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
	medium_dialog: {
		minHeight: '120px',
		minWidth: '240px',
		maxWidth: '360px'
	},
	small_dialog: {
		minHeight: '80px',
		minWidth: '200px',
		maxWidth: '320px'
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
	small_dropdown_select: {
		width: '52px',
		maxHeight: '28px'
	},
	small_dropdown_item: {
		// width: '52px',
		height: '28px',
		minHeight: '28px',
		maxHeight: '28px',
		margin: '4px',
		justifyContent: 'center'
	}
};
