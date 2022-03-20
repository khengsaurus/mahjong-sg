import { blue, indigo, red, teal, yellow } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BackgroundColor, TableColor, TextColor, TransitionSpeed } from 'enums';
import { isMobile } from 'platform';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IStore } from 'store';

export function getHighlightColor(color: TableColor | BackgroundColor) {
	if ([TableColor.DARK, BackgroundColor.DARK].includes(color)) {
		return blue[700];
	} else if ([TableColor.BROWN, BackgroundColor.BROWN].includes(color)) {
		return indigo[500];
	} else if ([TableColor.GREEN, BackgroundColor.GREEN].includes(color)) {
		return red[500];
	} else if ([TableColor.RED, BackgroundColor.RED].includes(color)) {
		return teal[500];
		// } else if ([TableColor.YELLOW, BackgroundColor.YELLOW].includes(color)) {
		// 	return red[700];
	} else if ([TableColor.BLUE, BackgroundColor.BLUE].includes(color)) {
		return yellow[700];
	} else {
		return red[500];
	}
}

export const HomeTheme = (props: any) => {
	const {
		theme: { backgroundColor = BackgroundColor.BROWN, mainTextColor = TextColor.DARK }
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

function newMuiTheme(
	backgroundColor: BackgroundColor | TableColor,
	textColor: TextColor,
	highlightColor: string
) {
	const accordionWidth = {
		// ref: misc.scss content-width
		minWidth: '200px',
		width: '80vw',
		maxWidth: '450px'
	};

	return createTheme({
		palette: {
			primary: { main: textColor },
			secondary: { main: highlightColor },
			text: { primary: textColor },
			action: {
				disabled: 'grey'
			}
		},
		typography: {
			body1: { color: textColor },
			body2: { color: textColor },
			h6: {
				fontSize: 18,
				color: textColor
			},
			subtitle1: { color: textColor },
			subtitle2: { color: textColor }
		},

		components: {
			MuiAccordion: {
				styleOverrides: {
					root: {
						backgroundColor,
						boxShadow: 'none',
						...accordionWidth,
						'&:before': { content: 'none' },
						'&.Mui-expanded': {
							margin: '0px'
						}
					}
				}
			},
			MuiAccordionDetails: {
				styleOverrides: {
					root: {
						backgroundColor,
						padding: 2,
						overflowX: 'hidden',
						overflowY: 'scroll',
						...accordionWidth
						// borderTop: `1px solid ${highlightColor}`,
						// borderBottom: `1px solid ${highlightColor}`
					}
				}
			},
			MuiAccordionSummary: {
				styleOverrides: {
					root: {
						backgroundColor,
						boxShadow: 'none',
						color: textColor,
						minHeight: '40px',
						...accordionWidth,
						padding: 0,
						'&.Mui-expanded': {
							minHeight: '40px'
						}
					},
					content: {
						margin: `4px 0px`,
						'&.Mui-expanded': {
							margin: `4px 0px !important`
						}
					},
					expandIconWrapper: {
						color: textColor,
						transition: TransitionSpeed.MEDIUM,
						'&:hover': {
							color: isMobile ? textColor : highlightColor
						},
						'&.Mui-expanded': {
							color: highlightColor,
							transform: 'rotate(90deg)'
						}
					}
				}
			},
			MuiButtonBase: {
				styleOverrides: {
					root: {
						primary: `${textColor}`,
						secondary: `${highlightColor}`,
						'&:hover': {
							color: isMobile ? `${textColor}` : `${highlightColor}`
						},
						'&:disabled': {
							color: 'rgb(75, 75, 75)'
						},
						margin: 0
					}
				}
			},
			MuiButton: {
				styleOverrides: {
					root: {
						primary: `${textColor}`,
						secondary: `${highlightColor}`,
						backgroundColor: 'transparent !important',
						'&:hover': {
							transform: isMobile ? `` : `scale(1.05)`,
							transition: '150ms !important'
						},
						'&:disabled': {
							color: 'rgb(75, 75, 75)'
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
						margin: '18px',
						maxHeight: 'calc(100% - 36px)',
						overflow: 'hidden',
						overflowX: 'hidden',
						overflowY: 'hidden',
						userSelect: 'none',
						backgroundColor
					}
				}
			},
			MuiDialogActions: {
				styleOverrides: {
					root: {
						padding: '0px',
						marginTop: '-4px',
						justifyContent: 'space-between',
						minHeight: '15px'
					}
				}
			},
			MuiDialogContent: {
				styleOverrides: {
					root: {
						padding: '10px 15px 0px 15px',
						userSelect: 'none',
						'&:first-of-type': { paddingTop: null }
					}
				}
			},
			MuiDivider: {
				styleOverrides: {
					root: {
						margin: '8px 0px',
						borderColor: textColor
						// '&:first-of-type': { paddingTop: null }
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
							color: isMobile ? `${textColor}` : `${highlightColor}`,
							transform: isMobile ? `` : `scale(1.1)`,
							transition: '150ms !important'
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
							color: isMobile ? `${textColor}` : `${highlightColor}`
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
							color: isMobile ? `${textColor}` : `${highlightColor}`
						}
					}
				}
			},
			MuiTab: {
				styleOverrides: {
					root: {
						color: `${textColor}`,
						minHeight: '32px !important',
						justifyContent: 'baseline',
						fontSize: '1rem'
					}
				}
			}
		}
	});
}

export const MuiStyles = {
	large_dialog: {
		maxWidth: '500px',
		transition: TransitionSpeed.MEDIUM
	},
	medium_dialog: {
		minHeight: '80px',
		minWidth: '200px',
		maxWidth: '450px',
		transition: TransitionSpeed.MEDIUM
	},
	small_dialog: {
		minHeight: '50px',
		minWidth: '200px',
		maxWidth: '350px',
		transition: TransitionSpeed.MEDIUM
	},
	single_action: {
		justifyContent: 'center',
		padding: '0px 8px',
		minHeight: '15px'
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
		height: '32px'
	},
	tabOptions: {
		minWidth: '67px',
		maxWidth: '67px',
		minHeight: '32px',
		maxHeight: '32px'
	},
	tabColorOptions: {
		minWidth: '40px',
		maxWidth: '40px',
		minHeight: '32px',
		maxHeight: '32px'
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
		height: '28px',
		minHeight: '28px',
		maxHeight: '28px',
		margin: '2px',
		justifyContent: 'center'
	}
};
