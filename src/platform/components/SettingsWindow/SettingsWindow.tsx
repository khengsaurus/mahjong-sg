import { Alert, Collapse, Dialog, DialogContent, FormControl, Paper, Tab, Tabs } from '@mui/material';
import { history } from 'App';
import { extend, isEqual } from 'lodash';
import ServiceInstance from 'platform/service/ServiceLayer';
import { MuiStyles, TableTheme } from 'platform/style/MuiStyles';
import { Row } from 'platform/style/StyledComponents';
import { StyledButton, StyledText } from 'platform/style/StyledMui';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	AlertStatus,
	BackgroundColor,
	Page,
	Size,
	Status,
	TableColor,
	TileColor,
	Transition,
	Visitor
} from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { ErrorMessage } from 'shared/messages';
import { ButtonText } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { setSizes, setTheme } from 'shared/store/actions';
import { ModalProps } from 'shared/typesPlus';
import { getTheme } from 'shared/util';
import './settingsWindow.scss';

interface IPreference {
	label: string;
	size?: Size;
	selectedColor?: BackgroundColor | TableColor | TileColor;
	colors?: any[];
	handleSelect: (value: Size | BackgroundColor | TableColor | TileColor) => void;
}

interface SettingsWindowProps extends ModalProps {
	accActions?: boolean;
}

const SettingsWindow = ({ offset, onClose, show, accActions = false }: SettingsWindowProps) => {
	const { alert, handleLocalUO, setAlert, logout } = useContext(AppContext);
	const { user, theme, sizes } = useSelector((state: IStore) => state);
	const [backgroundColor, setBackgroundColor] = useState(theme?.backgroundColor);
	const [tableColor, setTableColor] = useState(theme?.tableColor);
	const [tileColor, setTileColor] = useState(theme?.tileColor);
	const [controlsSize, setControlsSize] = useState(sizes?.controlsSize);
	const [handSize, setHandSize] = useState(sizes?.handSize);
	const [tileSize, setTileSize] = useState(sizes?.tileSize);
	const [showDeleteAlert, setShowDeleteAlert] = useState(false);
	const dispatch = useDispatch();

	// const transform =
	// 	offset && process.env.REACT_APP_PLATFORM === Platform.MOBILE ? `translateY(-${Offset.HALF_MOBILE})` : null;

	const flagThemeDiff = useMemo(
		() => !isEqual([backgroundColor, tableColor, tileColor], [user.bgC, user.tC, user.tBC]),
		[backgroundColor, tableColor, user.bgC, user.tC, user.tBC, tileColor]
	);

	const flagSizesDiff = useMemo(
		() => !isEqual([controlsSize, handSize, tileSize], [user.cSz, user.hSz, user.tSz]),
		[controlsSize, handSize, user.cSz, user.hSz, user.tSz, tileSize]
	);

	useEffect(() => {
		dispatch(setTheme(getTheme(backgroundColor, tableColor, tileColor)));
	}, [dispatch, backgroundColor, tableColor, tileColor]);

	useEffect(() => {
		dispatch(
			setSizes({
				handSize,
				tileSize,
				controlsSize
			})
		);
	}, [dispatch, controlsSize, handSize, tileSize]);

	const preferences: IPreference[] = [
		{
			label: 'Controls',
			size: controlsSize,
			handleSelect: (s: Size) => {
				setControlsSize(s);
			}
		},
		{
			label: 'Hand',
			size: handSize,
			handleSelect: (s: Size) => {
				setHandSize(s);
			}
		},
		{
			label: 'Tiles',
			size: tileSize,
			handleSelect: (s: Size) => {
				setTileSize(s);
			}
		},
		{
			label: 'Background',
			selectedColor: backgroundColor,
			handleSelect: (bgc: BackgroundColor) => {
				setBackgroundColor(bgc);
			},
			colors: Object.keys(BackgroundColor).map(key => BackgroundColor[key.toUpperCase()])
		},
		{
			label: 'Table',
			selectedColor: tableColor,
			handleSelect: (tc: TableColor) => {
				setTableColor(tc);
			},
			colors: Object.keys(TableColor).map(key => TableColor[key.toUpperCase()])
		},
		{
			label: 'Tiles',
			selectedColor: tileColor,
			handleSelect: (tbc: TileColor) => {
				setTileColor(tbc);
			},
			colors: Object.keys(TileColor).map(key => TileColor[key.toUpperCase()])
		}
	];

	function handleClose() {
		if (user?.id !== Visitor && (flagSizesDiff || flagThemeDiff)) {
			const keyVal = {
				cSz: controlsSize,
				hSz: handSize,
				tSz: tileSize,
				bgC: backgroundColor,
				tC: tableColor,
				tBC: tileColor
			};
			ServiceInstance.FBUpdateUser(user.id, keyVal)
				.then(() => {
					const updatedUser = extend(user, keyVal);
					handleLocalUO(updatedUser);
				})
				.catch(err => {
					console.error(err);
				});
		}
		onClose();
	}

	async function handleDeleteAccount() {
		setAlert(null);
		await ServiceInstance.FBDeleteUser(user).then(res => {
			if (res) {
				logout();
				history.push(Page.LOGIN);
			} else {
				setAlert({ status: Status.ERROR, msg: ErrorMessage.DELETE_ERROR });
			}
		});
	}

	const DeleteAlert: React.FC = () => {
		function handleClose() {
			setShowDeleteAlert(false);
			setAlert(null);
		}

		return (
			<Dialog open={showDeleteAlert} BackdropProps={{ invisible: true }} onClose={handleClose}>
				<DialogContent style={{ paddingBottom: 0 }}>
					<StyledText
						title="Are you sure you wish to delete your account?"
						variant="subtitle1"
						textAlign="center"
						padding="0px"
					/>
					<StyledText
						title="There's no undoing this action!"
						variant="subtitle2"
						textAlign="center"
						padding="2px"
					/>
					<Row>
						<StyledButton label={ButtonText.CANCEL} onClick={handleClose} />
						<StyledButton label={ButtonText.DELETE} onClick={handleDeleteAccount} />
					</Row>
					<Collapse in={!!alert} timeout={{ enter: Transition.FAST, exit: Transition.INSTANT }} unmountOnExit>
						<>
							<Alert severity={alert?.status as AlertStatus}>
								{alert?.msg || ErrorMessage.TRY_AGAIN}
							</Alert>
							<br />
						</>
					</Collapse>
				</DialogContent>
			</Dialog>
		);
	};

	const Label = ({ label }: IHasLabel) => (
		<StyledText title={label} variant="subtitle1" padding="0px" style={{ height: 30, marginTop: 2 }} />
	);

	return (
		<TableTheme>
			{showDeleteAlert ? (
				<DeleteAlert />
			) : (
				<Dialog
					open={show}
					BackdropProps={{ invisible: true }}
					onClose={handleClose}
					PaperProps={{
						style: {
							...MuiStyles.large_dialog
						}
					}}
					// style={{ transform }}
				>
					<DialogContent>
						<FormControl component="fieldset">
							{preferences.map(preference =>
								preference.size ? (
									<div className="preference" key={`preference-${preference.label}`}>
										<Label label={preference.label} />
										<Tabs
											style={{
												...MuiStyles.tabs,
												display: 'inline-block'
											}}
											value={preference.size}
											indicatorColor="secondary"
										>
											{Object.keys(Size).map(key => {
												const size = Size[key.toUpperCase()];
												return (
													<Tab
														style={{
															...MuiStyles.tabOptions
														}}
														// fullWidth={false}
														key={size}
														value={size}
														label={size[0]}
														onClick={() => {
															preference.handleSelect(size);
														}}
													/>
												);
											})}
										</Tabs>
									</div>
								) : null
							)}
							{preferences.map(preference =>
								preference.colors ? (
									<div className="preference" key={`preference-${preference.label}`}>
										<Label label={preference.label} />
										{/* <Typography variant="subtitle1" display="inline">
												{`${preference.label}:`}
											</Typography> */}
										<Paper style={{ ...MuiStyles.tabs, backgroundColor: 'transparent' }}>
											<Tabs
												style={{
													...MuiStyles.tabs,
													display: 'inline-block'
												}}
												value={preference.selectedColor}
												indicatorColor="secondary"
											>
												{preference.colors.map(rgb => (
													<Tab
														style={{
															...MuiStyles.tabColorOptions,
															backgroundColor: rgb
														}}
														key={rgb}
														value={rgb}
														onClick={() => {
															preference.handleSelect(rgb);
														}}
													/>
												))}
											</Tabs>
										</Paper>
									</div>
								) : null
							)}
						</FormControl>
						{accActions && (
							<Row style={{ alignItems: 'center', marginTop: 15 }}>
								<StyledButton
									label={ButtonText.DELETE_ACCOUNT}
									onClick={() => setShowDeleteAlert(true)}
									padding={'0'}
								/>
							</Row>
						)}
					</DialogContent>
				</Dialog>
			)}
		</TableTheme>
	);
};

export default SettingsWindow;
