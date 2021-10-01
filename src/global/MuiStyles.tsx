import { blue, indigo } from '@material-ui/core/colors';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { useContext, useMemo } from 'react';
import { AppContext } from '../util/hooks/AppContext';
import { TextColors } from './enums';

export const HomeTheme = (props: any) => {
	const { mainTextColor } = useContext(AppContext);
	const highlightColor = useMemo(() => {
		return mainTextColor === TextColors.LIGHT ? blue[700] : indigo[500];
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
						color: `${highlightColor}`
					}
				}
			},
			MuiButton: {
				root: {
					disableRipple: true,
					'&:hover': {
						backgroundColor: 'transparent !imporant',
						color: `${highlightColor}`
					}
				}
			},
			MuiIconButton: {
				root: {
					disableRipple: true,
					color: `${mainTextColor}`,
					'&:hover': {
						color: `${highlightColor}`
					}
				}
			},
			MuiListItem: {
				root: {
					backgroundColor: 'transparent !imporant',
					color: mainTextColor,
					'&:hover': {
						color: `${highlightColor}`
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
	const { tableColor, tableTextColor } = useContext(AppContext);
	const highlightColor = useMemo(() => {
		return tableTextColor === TextColors.LIGHT ? blue[700] : indigo[500];
	}, [tableTextColor]);

	const theme = createTheme({
		overrides: {
			MuiFormLabel: {
				root: {
					color: tableTextColor
				}
			},
			MuiRadio: {
				root: {
					color: tableTextColor
				}
			},
			MuiCheckbox: {
				root: {
					color: tableTextColor
				}
			},
			MuiButton: {
				root: {
					disableRipple: true,
					color: `${tableTextColor}`,
					'&:hover': {
						backgroundColor: 'transparent !imporant',
						color: `${highlightColor}`
					}
				}
			},
			MuiIconButton: {
				root: {
					disableRipple: true,
					color: `${tableTextColor}`,
					'&:hover': {
						backgroundColor: 'transparent !imporant',
						color: `${highlightColor}`
					}
				}
			},
			MuiDialog: {
				paper: {
					backgroundColor: tableColor,
					maxWidth: '420px !important',
					minWidth: '420px !important',
					overflow: 'scroll'
				}
			},
			MuiPopover: {
				paper: {
					backgroundColor: tableColor
				}
			},
			MuiInput: {
				underline: {
					'&&::before': {
						borderColor: tableTextColor
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
			MuiList: {
				root: {
					backgroundColor: tableColor
				},
				padding: {
					paddingTop: '0px',
					paddingBottom: '0px'
				}
			},
			MuiListItem: {
				root: {
					backgroundColor: tableColor,
					maxHeight: '30px !important',
					minHeight: '30px !important',
					overflowY: 'scroll',
					paddingLeft: '15px'
				}
			},
			MuiMenuItem: {
				root: {
					justifyContent: 'center',
					'&$selected': {
						backgroundColor: 'transparent'
					}
				}
			},
			MuiSelect: {
				select: {
					textAlign: 'center',
					paddingLeft: '12px !important',
					paddingRight: '12px !important',
					'&:focus': {
						backgroundColor: 'transparent'
					}
				}
			}
		},
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
		},
		typography: {
			h6: {
				color: tableTextColor
			},
			subtitle1: {
				color: tableTextColor
			}
		}
	});
	return <ThemeProvider theme={theme} {...props} />;
};

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
